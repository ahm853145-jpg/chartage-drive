<?php
/**
 * CARTHAGE DRIVE - Booking Controller
 * Handles booking operations (list, details, create, update, cancel)
 */

class BookingController extends BaseController {

    /**
     * Get bookings
     * GET /api/bookings
     */
    public function getAll() {
        if (!$this->isGet()) {
            ApiResponse::error('Method not allowed', 405);
        }

        $this->requireAuth();

        $page = (int)($_GET['page'] ?? 1);
        $perPage = (int)($_GET['per_page'] ?? 10);

        $bookingModel = new Booking($this->db);

        // If user is admin, get all bookings. Otherwise, get user's bookings only
        if ($this->isAdmin()) {
            $filters = [];
            if (isset($_GET['status'])) {
                $filters['status'] = $_GET['status'];
            }
            $bookings = $bookingModel->getAll($filters, $page, $perPage);
            $total = $bookingModel->getTotalCount($filters);
        } else {
            $bookings = $bookingModel->getUserBookings($this->getUserId(), $page, $perPage);
            $total = $bookingModel->getUserBookingCount($this->getUserId());
        }

        ApiResponse::paginated($bookings, $total, $page, $perPage, 'Bookings retrieved successfully');
    }

    /**
     * Get booking details
     * GET /api/bookings/:id
     */
    public function getById($id) {
        if (!$this->isGet()) {
            ApiResponse::error('Method not allowed', 405);
        }

        $this->requireAuth();

        $bookingModel = new Booking($this->db);
        $booking = $bookingModel->findById($id);

        if (!$booking) {
            ApiResponse::notFound('Booking not found');
        }

        // Check authorization
        if (!$this->isAdmin() && $booking['user_id'] != $this->getUserId()) {
            ApiResponse::forbidden('You do not have access to this booking');
        }

        ApiResponse::success($booking, 'Booking retrieved successfully');
    }

    /**
     * Create new booking
     * POST /api/bookings
     */
    public function create() {
        if (!$this->isPost()) {
            ApiResponse::error('Method not allowed', 405);
        }

        $this->requireAuth();

        // Validate input
        $rules = [
            'car_id' => 'required|numeric',
            'start_date' => 'required',
            'end_date' => 'required',
            'pickup_location' => 'required|min:2',
            'return_location' => 'required|min:2'
        ];

        $errors = $this->validate($this->request, $rules);

        if (!empty($errors)) {
            ApiResponse::validationError($errors);
        }

        // Validate dates
        $startDate = strtotime($this->request['start_date']);
        $endDate = strtotime($this->request['end_date']);

        if ($startDate === false || $endDate === false) {
            ApiResponse::validationError(['dates' => 'Invalid date format']);
        }

        if ($endDate <= $startDate) {
            ApiResponse::validationError(['end_date' => 'End date must be after start date']);
        }

        // A booking can start today. Compare dates at midnight rather than
        // comparing the selected date (00:00) with the current time.
        $today = strtotime(date('Y-m-d'));
        if ($startDate < $today) {
            ApiResponse::validationError(['start_date' => 'Start date cannot be in the past']);
        }

        // Get car
        $carModel = new Car($this->db);
        $car = $carModel->findById($this->request['car_id']);

        if (!$car) {
            ApiResponse::notFound('Car not found');
        }

        // Check availability
        if (!$carModel->checkAvailability(
            $this->request['car_id'],
            $this->request['start_date'],
            $this->request['end_date']
        )) {
            ApiResponse::error('Car is not available for selected dates', 400);
        }

        // Calculate total days and price
        $totalDays = ceil(($endDate - $startDate) / 86400);
        $totalPrice = $totalDays * $car['price_per_day'];

        // Generate booking number
        $bookingNumber = $this->generateBookingNumber();

        // Create booking
        $bookingData = [
            'booking_number' => $bookingNumber,
            'user_id' => $this->getUserId(),
            'car_id' => $this->request['car_id'],
            'start_date' => $this->request['start_date'],
            'end_date' => $this->request['end_date'],
            'pickup_location' => $this->request['pickup_location'],
            'return_location' => $this->request['return_location'],
            'total_days' => $totalDays,
            'price_per_day' => $car['price_per_day'],
            'total_price' => $totalPrice
        ];

        $bookingModel = new Booking($this->db);
        $bookingId = $bookingModel->create($bookingData);

        if (!$bookingId) {
            ApiResponse::error('Failed to create booking', 500);
        }

        // Auto-confirm booking
        $bookingModel->updateStatus($bookingId, 'CONFIRMED');

        // Create payment record
        $this->db->prepare('
            INSERT INTO payments (booking_id, amount, payment_method, status)
            VALUES (:booking_id, :amount, :payment_method, :status)
        ');
        $this->db->bind(':booking_id', $bookingId);
        $this->db->bind(':amount', $totalPrice);
        $this->db->bind(':payment_method', 'AGENCY');
        $this->db->bind(':status', 'PENDING');
        $this->db->execute();

        $booking = $bookingModel->findById($bookingId);

        ApiResponse::success($booking, 'Booking created successfully', 201);
    }

    /**
     * Update booking
     * PUT /api/bookings/:id
     */
    public function update($id) {
        if (!$this->isPut()) {
            ApiResponse::error('Method not allowed', 405);
        }

        $this->requireAuth();

        $bookingModel = new Booking($this->db);
        $booking = $bookingModel->findById($id);

        if (!$booking) {
            ApiResponse::notFound('Booking not found');
        }

        // Check authorization
        if (!$this->isAdmin() && $booking['user_id'] != $this->getUserId()) {
            ApiResponse::forbidden('You cannot modify this booking');
        }

        // Only allow modification of pending bookings
        if ($booking['status'] !== 'PENDING' && !$this->isAdmin()) {
            ApiResponse::error('Cannot modify confirmed bookings', 400);
        }

        // Validate input
        $rules = [
            'start_date' => 'required',
            'end_date' => 'required',
            'pickup_location' => 'required|min:2',
            'return_location' => 'required|min:2'
        ];

        $errors = $this->validate($this->request, $rules);

        if (!empty($errors)) {
            ApiResponse::validationError($errors);
        }

        // Validate dates
        $startDate = strtotime($this->request['start_date']);
        $endDate = strtotime($this->request['end_date']);

        if ($startDate === false || $endDate === false) {
            ApiResponse::validationError(['dates' => 'Invalid date format']);
        }

        if ($endDate <= $startDate) {
            ApiResponse::validationError(['end_date' => 'End date must be after start date']);
        }

        // Check availability (exclude current booking)
        $carModel = new Car($this->db);
        if (!$carModel->checkAvailability(
            $booking['car_id'],
            $this->request['start_date'],
            $this->request['end_date'],
            $id
        )) {
            ApiResponse::error('Car is not available for selected dates', 400);
        }

        // Get car for price
        $car = $carModel->findById($booking['car_id']);
        $totalDays = ceil(($endDate - $startDate) / 86400);
        $totalPrice = $totalDays * $car['price_per_day'];

        // Update booking
        $updateData = [
            'start_date' => $this->request['start_date'],
            'end_date' => $this->request['end_date'],
            'pickup_location' => $this->request['pickup_location'],
            'return_location' => $this->request['return_location'],
            'total_days' => $totalDays,
            'total_price' => $totalPrice
        ];

        if (!$bookingModel->update($id, $updateData)) {
            ApiResponse::error('Failed to update booking', 500);
        }

        $updatedBooking = $bookingModel->findById($id);

        ApiResponse::success($updatedBooking, 'Booking updated successfully');
    }

    /**
     * Cancel booking
     * DELETE /api/bookings/:id
     */
    public function cancel($id) {
        if (!$this->isDelete()) {
            ApiResponse::error('Method not allowed', 405);
        }

        $this->requireAuth();

        $bookingModel = new Booking($this->db);
        $booking = $bookingModel->findById($id);

        if (!$booking) {
            ApiResponse::notFound('Booking not found');
        }

        // Check authorization
        if (!$this->isAdmin() && $booking['user_id'] != $this->getUserId()) {
            ApiResponse::forbidden('You cannot cancel this booking');
        }

        // Cannot cancel completed or already cancelled bookings
        if (in_array($booking['status'], ['COMPLETED', 'CANCELLED'])) {
            ApiResponse::error('Cannot cancel this booking', 400);
        }

        // Update booking status
        if (!$bookingModel->updateStatus($id, 'CANCELLED')) {
            ApiResponse::error('Failed to cancel booking', 500);
        }

        // Update payment status
        $this->db->prepare('
            UPDATE payments SET status = "REFUNDED" WHERE booking_id = :booking_id
        ');
        $this->db->bind(':booking_id', $id);
        $this->db->execute();

        $cancelledBooking = $bookingModel->findById($id);

        ApiResponse::success($cancelledBooking, 'Booking cancelled successfully');
    }
}
