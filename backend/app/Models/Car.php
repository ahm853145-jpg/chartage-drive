<?php
/**
 * CARTHAGE DRIVE - Car Model
 * Handles database operations for cars
 */

class Car {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    /**
     * Find car by ID with images
     */
    public function findById($id) {
        $this->db->prepare('
            SELECT * FROM cars WHERE id = :id AND status = "ACTIVE"
        ');
        $this->db->bind(':id', $id);
        $car = $this->db->single();

        if ($car) {
            $car['images'] = $this->getImages($id);
        }

        return $car;
    }

    /**
     * Get car images
     */
    public function getImages($carId) {
        $this->db->prepare('
            SELECT id, image_url FROM car_images WHERE car_id = :car_id
        ');
        $this->db->bind(':car_id', $carId);
        return $this->db->resultSet();
    }

    /**
     * Get all cars with filters and sorting
     */
    public function getAll($filters = [], $sort = 'price_per_day', $order = 'ASC', $page = 1, $perPage = 12) {
        $query = 'SELECT * FROM cars WHERE status = "ACTIVE"';
        $params = [];

        // Apply filters
        if (!empty($filters['brand'])) {
            $query .= ' AND brand LIKE :brand';
            $params[':brand'] = '%' . $filters['brand'] . '%';
        }

        if (!empty($filters['model'])) {
            $query .= ' AND model LIKE :model';
            $params[':model'] = '%' . $filters['model'] . '%';
        }

        if (!empty($filters['category'])) {
            $query .= ' AND category = :category';
            $params[':category'] = $filters['category'];
        }

        if (isset($filters['price_min']) && $filters['price_min'] !== '') {
            $query .= ' AND price_per_day >= :price_min';
            $params[':price_min'] = (float)$filters['price_min'];
        }

        if (isset($filters['price_max']) && $filters['price_max'] !== '') {
            $query .= ' AND price_per_day <= :price_max';
            $params[':price_max'] = (float)$filters['price_max'];
        }

        if (!empty($filters['fuel_type'])) {
            $query .= ' AND fuel_type = :fuel_type';
            $params[':fuel_type'] = $filters['fuel_type'];
        }

        if (!empty($filters['transmission'])) {
            $query .= ' AND transmission = :transmission';
            $params[':transmission'] = $filters['transmission'];
        }

        if (isset($filters['seats']) && $filters['seats'] !== '') {
            $query .= ' AND seats >= :seats';
            $params[':seats'] = (int)$filters['seats'];
        }

        // Validate sort column
        $allowedSortColumns = ['price_per_day', 'year', 'brand', 'model', 'created_at'];
        $sort = in_array($sort, $allowedSortColumns) ? $sort : 'price_per_day';

        // Validate sort order
        $order = strtoupper($order) === 'DESC' ? 'DESC' : 'ASC';

        $query .= " ORDER BY {$sort} {$order}";

        // Apply pagination
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
     * Get total car count with filters
     */
    public function getTotalCount($filters = []) {
        $query = 'SELECT COUNT(*) as count FROM cars WHERE status = "ACTIVE"';

        if (!empty($filters['brand'])) {
            $query .= ' AND brand LIKE :brand';
        }
        if (!empty($filters['category'])) {
            $query .= ' AND category = :category';
        }
        if (isset($filters['price_min']) && $filters['price_min'] !== '') {
            $query .= ' AND price_per_day >= :price_min';
        }
        if (isset($filters['price_max']) && $filters['price_max'] !== '') {
            $query .= ' AND price_per_day <= :price_max';
        }

        $this->db->prepare($query);

        if (!empty($filters['brand'])) {
            $this->db->bind(':brand', '%' . $filters['brand'] . '%');
        }
        if (!empty($filters['category'])) {
            $this->db->bind(':category', $filters['category']);
        }
        if (isset($filters['price_min']) && $filters['price_min'] !== '') {
            $this->db->bind(':price_min', (float)$filters['price_min']);
        }
        if (isset($filters['price_max']) && $filters['price_max'] !== '') {
            $this->db->bind(':price_max', (float)$filters['price_max']);
        }

        $result = $this->db->single();
        return $result['count'] ?? 0;
    }

    /**
     * Check availability for date range
     */
    public function checkAvailability($carId, $startDate, $endDate, $excludeBookingId = null) {
        $query = '
            SELECT COUNT(*) as count
            FROM bookings
            WHERE car_id = :car_id
            AND status IN ("CONFIRMED", "IN_PROGRESS")
            AND (
                (start_date <= :end_date AND end_date >= :start_date)
            )
        ';

        if ($excludeBookingId) {
            $query .= ' AND id != :exclude_id';
        }

        $this->db->prepare($query);
        $this->db->bind(':car_id', $carId);
        $this->db->bind(':start_date', $startDate);
        $this->db->bind(':end_date', $endDate);

        if ($excludeBookingId) {
            $this->db->bind(':exclude_id', $excludeBookingId);
        }

        $result = $this->db->single();
        return ($result['count'] ?? 0) === 0;
    }

    /**
     * Create car (admin)
     */
    public function create($data) {
        $this->db->prepare('
            INSERT INTO cars (brand, model, year, category, price_per_day, fuel_type, transmission, seats, doors, description, status)
            VALUES (:brand, :model, :year, :category, :price_per_day, :fuel_type, :transmission, :seats, :doors, :description, :status)
        ');

        $this->db->bind(':brand', $data['brand']);
        $this->db->bind(':model', $data['model']);
        $this->db->bind(':year', (int)$data['year']);
        $this->db->bind(':category', $data['category']);
        $this->db->bind(':price_per_day', (float)$data['price_per_day']);
        $this->db->bind(':fuel_type', $data['fuel_type']);
        $this->db->bind(':transmission', $data['transmission']);
        $this->db->bind(':seats', (int)$data['seats']);
        $this->db->bind(':doors', (int)$data['doors']);
        $this->db->bind(':description', $data['description'] ?? null);
        $this->db->bind(':status', 'ACTIVE');

        if (!$this->db->execute()) {
            return false;
        }

        $carId = $this->db->lastInsertId();
        $imageUrl = trim($data['image_url'] ?? '');
        if ($imageUrl !== '' && !$this->savePrimaryImage($carId, $imageUrl)) {
            return false;
        }

        return $carId;
    }

    /**
     * Update car (admin)
     */
    public function update($id, $data) {
        $this->db->prepare('
            UPDATE cars
            SET brand = :brand,
                model = :model,
                year = :year,
                category = :category,
                price_per_day = :price_per_day,
                fuel_type = :fuel_type,
                transmission = :transmission,
                seats = :seats,
                doors = :doors,
                description = :description,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = :id
        ');

        $this->db->bind(':id', $id);
        $this->db->bind(':brand', $data['brand']);
        $this->db->bind(':model', $data['model']);
        $this->db->bind(':year', (int)$data['year']);
        $this->db->bind(':category', $data['category']);
        $this->db->bind(':price_per_day', (float)$data['price_per_day']);
        $this->db->bind(':fuel_type', $data['fuel_type']);
        $this->db->bind(':transmission', $data['transmission']);
        $this->db->bind(':seats', (int)$data['seats']);
        $this->db->bind(':doors', (int)$data['doors']);
        $this->db->bind(':description', $data['description'] ?? null);

        if (!$this->db->execute()) {
            return false;
        }

        $imageUrl = trim($data['image_url'] ?? '');
        return $imageUrl === '' || $this->savePrimaryImage($id, $imageUrl);
    }

    /** Save or replace the primary image while preserving any additional gallery images. */
    private function savePrimaryImage($carId, $imageUrl) {
        $this->db->prepare('SELECT id FROM car_images WHERE car_id = :car_id ORDER BY id ASC LIMIT 1');
        $this->db->bind(':car_id', $carId);
        $existingImage = $this->db->single();

        if ($existingImage) {
            $this->db->prepare('UPDATE car_images SET image_url = :image_url WHERE id = :id');
            $this->db->bind(':id', $existingImage['id']);
        } else {
            $this->db->prepare('INSERT INTO car_images (car_id, image_url) VALUES (:car_id, :image_url)');
            $this->db->bind(':car_id', $carId);
        }

        $this->db->bind(':image_url', $imageUrl);
        return $this->db->execute();
    }

    /**
     * Delete car (admin)
     */
    public function delete($id) {
        $this->db->prepare('
            UPDATE cars SET status = "INACTIVE", updated_at = CURRENT_TIMESTAMP WHERE id = :id
        ');
        $this->db->bind(':id', $id);
        return $this->db->execute();
    }

    /**
     * Get popular cars
     */
    public function getPopular($limit = 6) {
        $this->db->prepare('
            SELECT c.* FROM cars c
            WHERE c.status = "ACTIVE"
            ORDER BY RAND()
            LIMIT :limit
        ');
        $this->db->bind(':limit', $limit, PDO::PARAM_INT);
        return $this->db->resultSet();
    }
}
