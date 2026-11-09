<?php
/**
 * CARTHAGE DRIVE - Booking Model
 * Handles database operations for bookings
 */

class Booking {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    /**
     * Find booking by ID
     */
    public function findById($id) {
        $this->db->prepare('
            SELECT b.*, c.brand, c.model, c.year, c.price_per_day as car_price,
                   u.first_name, u.last_name, u.email, u.phone
            FROM bookings b
            JOIN cars c ON b.car_id = c.id
            JOIN users u ON b.user_id = u.id
            WHERE b.id = :id
        ');
        $this->db->bind(':id', $id);
        return $this->db->single();
    }

    /**
     * Find booking by booking number
     */
    public function findByNumber($bookingNumber) {
        $this->db->prepare('
            SELECT b.*, c.brand, c.model, c.year,
                   u.first_name, u.last_name, u.email
            FROM bookings b
            JOIN cars c ON b.car_id = c.id
            JOIN users u ON b.user_id = u.id
            WHERE b.booking_number = :booking_number
        ');
        $this->db->bind(':booking_number', $bookingNumber);
        return $this->db->single();
    }

    /**
     * Get user bookings
     */
    public function getUserBookings($userId, $page = 1, $perPage = 10) {
        $offset = ($page - 1) * $perPage;

        $this->db->prepare('
            SELECT b.*, c.brand, c.model, c.year, c.price_per_day as car_price
            FROM bookings b
            JOIN cars c ON b.car_id = c.id
            WHERE b.user_id = :user_id
            ORDER BY b.created_at DESC
            LIMIT :limit OFFSET :offset
        ');

        $this->db->bind(':user_id', $userId);
        $this->db->bind(':limit', $perPage, PDO::PARAM_INT);
        $this->db->bind(':offset', $offset, PDO::PARAM_INT);

        return $this->db->resultSet();
    }

    /**
     * Get user booking count
     */
    public function getUserBookingCount($userId) {
        $this->db->prepare('SELECT COUNT(*) as count FROM bookings WHERE user_id = :user_id');
        $this->db->bind(':user_id', $userId);
        $result = $this->db->single();
        return $result['count'] ?? 0;
    }

    /**
     * Get all bookings (admin)
     */
    public function getAll($filters = [], $page = 1, $perPage = 10) {
        $query = '
            SELECT b.*, c.brand, c.model, u.first_name, u.last_name, u.email
            FROM bookings b
            JOIN cars c ON b.car_id = c.id
            JOIN users u ON b.user_id = u.id
            WHERE 1=1
        ';

        $params = [];

        if (!empty($filters['status'])) {
            $query .= ' AND b.status = :status';
            $params[':status'] = $filters['status'];
        }

        if (!empty($filters['user_id'])) {
            $query .= ' AND b.user_id = :user_id';
            $params[':user_id'] = $filters['user_id'];
        }

        if (!empty($filters['car_id'])) {
            $query .= ' AND b.car_id = :car_id';
            $params[':car_id'] = $filters['car_id'];
        }

        $query .= ' ORDER BY b.created_at DESC';

        $offset = ($page - 1) * $perPage;
        $query .= ' LIMIT :limit OFFSET :offset';

        $this->db->prepare($query);

        foreach ($params as $key => $value) {
            $this->db->bind($key, $value);
        }

        $this->db->bind(':limit', $perPage, PDO::PARAM_INT);
        $this->db->bind(':offset', $offset, PDO::PARAM_INT);

        return $this->db->resultSet();
    }

    /**
     * Get total booking count
     */
    public function getTotalCount($filters = []) {
        $query = 'SELECT COUNT(*) as count FROM bookings WHERE 1=1';

        if (!empty($filters['status'])) {
            $query .= ' AND status = :status';
        }

        $this->db->prepare($query);

        if (!empty($filters['status'])) {
            $this->db->bind(':status', $filters['status']);
        }

        $result = $this->db->single();
        return $result['count'] ?? 0;
    }

    /**
     * Create new booking
     */
    public function create($data) {
        $this->db->prepare('
            INSERT INTO bookings (
                booking_number, user_id, car_id, start_date, end_date,
                pickup_location, return_location, total_days, price_per_day, total_price, status
            )
            VALUES (
                :booking_number, :user_id, :car_id, :start_date, :end_date,
                :pickup_location, :return_location, :total_days, :price_per_day, :total_price, :status
            )
        ');

        $this->db->bind(':booking_number', $data['booking_number']);
        $this->db->bind(':user_id', $data['user_id']);
        $this->db->bind(':car_id', $data['car_id']);
        $this->db->bind(':start_date', $data['start_date']);
        $this->db->bind(':end_date', $data['end_date']);
        $this->db->bind(':pickup_location', $data['pickup_location']);
        $this->db->bind(':return_location', $data['return_location']);
        $this->db->bind(':total_days', (int)$data['total_days']);
        $this->db->bind(':price_per_day', (float)$data['price_per_day']);
        $this->db->bind(':total_price', (float)$data['total_price']);
        $this->db->bind(':status', 'PENDING');

        if ($this->db->execute()) {
            return $this->db->lastInsertId();
        }

        return false;
    }

    /**
     * Update booking status
     */
    public function updateStatus($id, $status) {
        $this->db->prepare('
            UPDATE bookings SET status = :status, updated_at = CURRENT_TIMESTAMP WHERE id = :id
        ');

        $this->db->bind(':id', $id);
        $this->db->bind(':status', $status);

        return $this->db->execute();
    }

    /**
     * Update booking
     */
    public function update($id, $data) {
        $this->db->prepare('
            UPDATE bookings
            SET start_date = :start_date,
                end_date = :end_date,
                pickup_location = :pickup_location,
                return_location = :return_location,
                total_days = :total_days,
                total_price = :total_price,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = :id
        ');

        $this->db->bind(':id', $id);
        $this->db->bind(':start_date', $data['start_date']);
        $this->db->bind(':end_date', $data['end_date']);
        $this->db->bind(':pickup_location', $data['pickup_location']);
        $this->db->bind(':return_location', $data['return_location']);
        $this->db->bind(':total_days', (int)$data['total_days']);
        $this->db->bind(':total_price', (float)$data['total_price']);

        return $this->db->execute();
    }

    /** Update all editable reservation fields from the admin panel. */
    public function adminUpdate($id, $data) {
        $this->db->prepare('
            UPDATE bookings
            SET car_id = :car_id,
                start_date = :start_date,
                end_date = :end_date,
                pickup_location = :pickup_location,
                return_location = :return_location,
                total_days = :total_days,
                price_per_day = :price_per_day,
                total_price = :total_price,
                status = :status,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = :id
        ');

        $this->db->bind(':id', (int)$id, PDO::PARAM_INT);
        $this->db->bind(':car_id', (int)$data['car_id'], PDO::PARAM_INT);
        $this->db->bind(':start_date', $data['start_date']);
        $this->db->bind(':end_date', $data['end_date']);
        $this->db->bind(':pickup_location', $data['pickup_location']);
        $this->db->bind(':return_location', $data['return_location']);
        $this->db->bind(':total_days', (int)$data['total_days'], PDO::PARAM_INT);
        $this->db->bind(':price_per_day', (float)$data['price_per_day']);
        $this->db->bind(':total_price', (float)$data['total_price']);
        $this->db->bind(':status', $data['status']);

        return $this->db->execute();
    }

    /**
     * Get dashboard statistics
     */
    public function getDashboardStats() {
        $this->db->prepare('
            SELECT
                COUNT(*) as total_bookings,
                SUM(CASE WHEN status = "CONFIRMED" THEN 1 ELSE 0 END) as confirmed,
                SUM(CASE WHEN status = "PENDING" THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN status = "IN_PROGRESS" THEN 1 ELSE 0 END) as in_progress,
                SUM(CASE WHEN status = "COMPLETED" THEN 1 ELSE 0 END) as completed,
                SUM(CASE WHEN status = "CANCELLED" THEN 1 ELSE 0 END) as cancelled,
                SUM(CASE WHEN status IN ("CONFIRMED", "COMPLETED") THEN total_price ELSE 0 END) as total_revenue
            FROM bookings
        ');

        return $this->db->single();
    }

    /**
     * Get user active bookings
     */
    public function getUserActiveBookings($userId) {
        $this->db->prepare('
            SELECT b.*, c.brand, c.model
            FROM bookings b
            JOIN cars c ON b.car_id = c.id
            WHERE b.user_id = :user_id AND b.status IN ("CONFIRMED", "IN_PROGRESS")
            ORDER BY b.start_date ASC
        ');

        $this->db->bind(':user_id', $userId);
        return $this->db->resultSet();
    }
}
