<?php
/**
 * CARTHAGE DRIVE - Admin Controller
 * Handles admin dashboard and management operations
 */

class AdminController extends BaseController {

    /**
     * Get admin dashboard statistics
     * GET /api/admin/dashboard
     */
    public function dashboard() {
        if (!$this->isGet()) {
            ApiResponse::error('Method not allowed', 405);
        }

        $this->requireAdmin();

        $carModel = new Car($this->db);
        $bookingModel = new Booking($this->db);
        $userModel = new User($this->db);

        // Get car statistics
        $this->db->prepare('
            SELECT
                COUNT(*) as total_cars,
                SUM(CASE WHEN status = "ACTIVE" THEN 1 ELSE 0 END) as active_cars,
                SUM(CASE WHEN status = "MAINTENANCE" THEN 1 ELSE 0 END) as maintenance_cars
            FROM cars
        ');
        $carStats = $this->db->single();

        // Get booking statistics
        $bookingStats = $bookingModel->getDashboardStats();

        // Count active rentals
        $this->db->prepare('
            SELECT COUNT(*) as count FROM bookings WHERE status = "IN_PROGRESS"
        ');
        $activeRentals = $this->db->single();

        // Get user statistics
        $totalUsers = $userModel->getTotalCount();

        // Monthly revenue (last 30 days)
        $this->db->prepare('
            SELECT SUM(total_price) as revenue
            FROM bookings
            WHERE status IN ("CONFIRMED", "COMPLETED")
            AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        ');
        $monthlyRevenue = $this->db->single();

        // Most popular cars
        $this->db->prepare('
            SELECT c.id, c.brand, c.model, COUNT(b.id) as booking_count
            FROM cars c
            LEFT JOIN bookings b ON c.id = b.car_id
            GROUP BY c.id
            ORDER BY booking_count DESC
            LIMIT 5
        ');
        $popularCars = $this->db->resultSet();

        $dashboard = [
            'cars' => $carStats,
            'bookings' => $bookingStats,
            'active_rentals' => $activeRentals['count'] ?? 0,
            'total_users' => $totalUsers,
            'monthly_revenue' => $monthlyRevenue['revenue'] ?? 0,
            'popular_cars' => $popularCars
        ];

        ApiResponse::success($dashboard, 'Dashboard statistics retrieved successfully');
    }

    /**
     * Get all users (admin)
     * GET /api/admin/users
     */
    public function getUsers() {
        if (!$this->isGet()) {
            ApiResponse::error('Method not allowed', 405);
        }

        $this->requireAdmin();

        $page = (int)($_GET['page'] ?? 1);
        $perPage = (int)($_GET['per_page'] ?? 10);

        $userModel = new User($this->db);
        $users = $userModel->getAll($page, $perPage);
        $total = $userModel->getTotalCount();

        // Add booking count for each user
        foreach ($users as &$user) {
            $user['booking_count'] = $userModel->getBookingCount($user['id']);
        }

        ApiResponse::paginated($users, $total, $page, $perPage, 'Users retrieved successfully');
    }

    /** Update a user from the admin panel. */
    public function updateUser($id) {
        if (!$this->isPut()) {
            ApiResponse::error('Method not allowed', 405);
        }
        $this->requireAdmin();

        $userModel = new User($this->db);
        $user = $userModel->findByIdForAdmin($id);
        if (!$user) {
            ApiResponse::notFound('User not found');
        }

        $rules = [
            'first_name' => 'required|min:2|max:100',
            'last_name' => 'required|min:2|max:100',
            'email' => 'required|email|max:255',
            'phone' => 'required|min:8|max:20'
        ];
        $errors = $this->validate($this->request, $rules);
        $role = $this->request['role'] ?? '';
        $status = $this->request['status'] ?? '';
        if (!in_array($role, ['CLIENT', 'ADMIN'], true)) {
            $errors['role'] = 'Role must be CLIENT or ADMIN';
        }
        if (!in_array($status, ['ACTIVE', 'INACTIVE', 'BANNED'], true)) {
            $errors['status'] = 'Status must be ACTIVE, INACTIVE or BANNED';
        }
        if (!empty($this->request['email']) && $userModel->emailExistsForAnotherUser($this->request['email'], $id)) {
            $errors['email'] = 'This email is already in use';
        }
        if ((int)$id === (int)$this->getUserId() && ($role !== 'ADMIN' || $status !== 'ACTIVE')) {
            $errors['account'] = 'You cannot remove your own admin access or deactivate your account';
        }
        if (!empty($errors)) {
            ApiResponse::validationError($errors);
        }

        $data = [
            'first_name' => trim($this->request['first_name']),
            'last_name' => trim($this->request['last_name']),
            'email' => trim($this->request['email']),
            'phone' => trim($this->request['phone']),
            'role' => $role,
            'status' => $status
        ];
        if (!$userModel->adminUpdate($id, $data)) {
            ApiResponse::error('Failed to update user', 500);
        }

        ApiResponse::success($userModel->findByIdForAdmin($id), 'User updated successfully');
    }

    /** Deactivate a user account without deleting booking history. */
    public function deactivateUser($id) {
        if (!$this->isDelete()) {
            ApiResponse::error('Method not allowed', 405);
        }
        $this->requireAdmin();
        if ((int)$id === (int)$this->getUserId()) {
            ApiResponse::error('You cannot deactivate your own admin account', 400);
        }

        $userModel = new User($this->db);
        if (!$userModel->findByIdForAdmin($id)) {
            ApiResponse::notFound('User not found');
        }
        if (!$userModel->setStatus($id, 'INACTIVE')) {
            ApiResponse::error('Failed to deactivate user', 500);
        }

        ApiResponse::success(null, 'User deactivated successfully');
    }

    /**
     * Get all bookings (admin)
     * GET /api/admin/bookings
     */
    public function getBookings() {
        if (!$this->isGet()) {
            ApiResponse::error('Method not allowed', 405);
        }

        $this->requireAdmin();

        $page = (int)($_GET['page'] ?? 1);
        $perPage = (int)($_GET['per_page'] ?? 10);

        $filters = [];
        if (isset($_GET['status'])) {
            $filters['status'] = $_GET['status'];
        }
        if (isset($_GET['user_id'])) {
            $filters['user_id'] = $_GET['user_id'];
        }
        if (isset($_GET['car_id'])) {
            $filters['car_id'] = $_GET['car_id'];
        }

        $bookingModel = new Booking($this->db);
        $bookings = $bookingModel->getAll($filters, $page, $perPage);
        $total = $bookingModel->getTotalCount($filters);

        ApiResponse::paginated($bookings, $total, $page, $perPage, 'Bookings retrieved successfully');
    }

    /** Update reservation details and status from the admin panel. */
    public function updateBooking($id) {
        if (!$this->isPut()) {
            ApiResponse::error('Method not allowed', 405);
        }
        $this->requireAdmin();

        $bookingModel = new Booking($this->db);
        $booking = $bookingModel->findById($id);
        if (!$booking) {
            ApiResponse::notFound('Booking not found');
        }

        $rules = [
            'car_id' => 'required|numeric',
            'start_date' => 'required',
            'end_date' => 'required',
            'pickup_location' => 'required|min:2|max:255',
            'return_location' => 'required|min:2|max:255'
        ];
        $errors = $this->validate($this->request, $rules);
        $status = $this->request['status'] ?? '';
        $allowedStatuses = ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
        if (!in_array($status, $allowedStatuses, true)) {
            $errors['status'] = 'Invalid reservation status';
        }
        if (!empty($errors)) {
            ApiResponse::validationError($errors);
        }

        $startDate = strtotime($this->request['start_date']);
        $endDate = strtotime($this->request['end_date']);
        if ($startDate === false || $endDate === false || $endDate <= $startDate) {
            ApiResponse::validationError(['dates' => 'Return date must be after pickup date']);
        }

        $carModel = new Car($this->db);
        $car = $carModel->findById((int)$this->request['car_id']);
        if (!$car) {
            ApiResponse::validationError(['car_id' => 'Choose an active vehicle']);
        }
        if (in_array($status, ['CONFIRMED', 'IN_PROGRESS'], true) && !$carModel->checkAvailability(
            (int)$this->request['car_id'],
            $this->request['start_date'],
            $this->request['end_date'],
            $id
        )) {
            ApiResponse::error('Vehicle is not available for those dates', 409);
        }

        $days = (int)ceil(($endDate - $startDate) / 86400);
        $data = [
            'car_id' => (int)$this->request['car_id'],
            'start_date' => date('Y-m-d', $startDate),
            'end_date' => date('Y-m-d', $endDate),
            'pickup_location' => trim($this->request['pickup_location']),
            'return_location' => trim($this->request['return_location']),
            'total_days' => $days,
            'price_per_day' => (float)$car['price_per_day'],
            'total_price' => $days * (float)$car['price_per_day'],
            'status' => $status
        ];
        if (!$bookingModel->adminUpdate($id, $data)) {
            ApiResponse::error('Failed to update reservation', 500);
        }

        if ($status === 'CANCELLED') {
            $this->db->prepare('UPDATE payments SET status = "REFUNDED" WHERE booking_id = :booking_id AND status = "PAID"');
            $this->db->bind(':booking_id', (int)$id, PDO::PARAM_INT);
            $this->db->execute();
        }

        ApiResponse::success($bookingModel->findById($id), 'Reservation updated successfully');
    }
}
