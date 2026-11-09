<?php
/**
 * CARTHAGE DRIVE - Car Controller
 * Handles car operations (list, details, create, update, delete)
 */

class CarController extends BaseController {

    /**
     * Get all cars with filters and sorting
     * GET /api/cars
     */
    public function getAll() {
        if (!$this->isGet()) {
            ApiResponse::error('Method not allowed', 405);
        }

        // Get filters from query string
        $filters = [];
        if (isset($_GET['brand']) && !empty($_GET['brand'])) {
            $filters['brand'] = $_GET['brand'];
        }
        if (isset($_GET['category']) && !empty($_GET['category'])) {
            $filters['category'] = $_GET['category'];
        }
        if (isset($_GET['price_min'])) {
            $filters['price_min'] = $_GET['price_min'];
        }
        if (isset($_GET['price_max'])) {
            $filters['price_max'] = $_GET['price_max'];
        }
        if (isset($_GET['fuel_type']) && !empty($_GET['fuel_type'])) {
            $filters['fuel_type'] = $_GET['fuel_type'];
        }
        if (isset($_GET['transmission']) && !empty($_GET['transmission'])) {
            $filters['transmission'] = $_GET['transmission'];
        }
        if (isset($_GET['seats'])) {
            $filters['seats'] = $_GET['seats'];
        }

        // Get sorting and pagination
        $sort = $_GET['sort'] ?? 'price_per_day';
        $order = $_GET['order'] ?? 'ASC';
        $page = (int)($_GET['page'] ?? 1);
        $perPage = (int)($_GET['per_page'] ?? 12);

        $carModel = new Car($this->db);
        $cars = $carModel->getAll($filters, $sort, $order, $page, $perPage);
        $total = $carModel->getTotalCount($filters);

        // Add images to each car
        foreach ($cars as &$car) {
            $car['images'] = $carModel->getImages($car['id']);
        }

        ApiResponse::paginated($cars, $total, $page, $perPage, 'Cars retrieved successfully');
    }

    /**
     * Get car details by ID
     * GET /api/cars/:id
     */
    public function getById($id) {
        if (!$this->isGet()) {
            ApiResponse::error('Method not allowed', 405);
        }

        $carModel = new Car($this->db);
        $car = $carModel->findById($id);

        if (!$car) {
            ApiResponse::notFound('Car not found');
        }

        ApiResponse::success($car, 'Car retrieved successfully');
    }

    /**
     * Create new car (admin only)
     * POST /api/cars
     */
    public function create() {
        if (!$this->isPost()) {
            ApiResponse::error('Method not allowed', 405);
        }

        $this->requireAdmin();

        // Validate input
        $rules = [
            'brand' => 'required|min:2|max:100',
            'model' => 'required|min:2|max:100',
            'year' => 'required|numeric',
            'category' => 'required',
            'price_per_day' => 'required|numeric',
            'fuel_type' => 'required',
            'transmission' => 'required',
            'seats' => 'required|numeric',
            'doors' => 'required|numeric'
        ];

        $errors = $this->validate($this->request, $rules);
        $this->validateImageUrl($errors);

        if (!empty($errors)) {
            ApiResponse::validationError($errors);
        }

        $carModel = new Car($this->db);
        $carId = $carModel->create($this->request);

        if (!$carId) {
            ApiResponse::error('Failed to create car', 500);
        }

        $car = $carModel->findById($carId);

        ApiResponse::success($car, 'Car created successfully', 201);
    }

    /**
     * Update car (admin only)
     * PUT /api/cars/:id
     */
    public function update($id) {
        if (!$this->isPut()) {
            ApiResponse::error('Method not allowed', 405);
        }

        $this->requireAdmin();

        $carModel = new Car($this->db);
        $car = $carModel->findById($id);

        if (!$car) {
            ApiResponse::notFound('Car not found');
        }

        // Validate input
        $rules = [
            'brand' => 'required|min:2|max:100',
            'model' => 'required|min:2|max:100',
            'year' => 'required|numeric',
            'category' => 'required',
            'price_per_day' => 'required|numeric',
            'fuel_type' => 'required',
            'transmission' => 'required',
            'seats' => 'required|numeric',
            'doors' => 'required|numeric'
        ];

        $errors = $this->validate($this->request, $rules);
        $this->validateImageUrl($errors);

        if (!empty($errors)) {
            ApiResponse::validationError($errors);
        }

        if (!$carModel->update($id, $this->request)) {
            ApiResponse::error('Failed to update car', 500);
        }

        $updatedCar = $carModel->findById($id);

        ApiResponse::success($updatedCar, 'Car updated successfully');
    }

    /**
     * Delete car (admin only)
     * DELETE /api/cars/:id
     */
    public function delete($id) {
        if (!$this->isDelete()) {
            ApiResponse::error('Method not allowed', 405);
        }

        $this->requireAdmin();

        $carModel = new Car($this->db);
        $car = $carModel->findById($id);

        if (!$car) {
            ApiResponse::notFound('Car not found');
        }

        if (!$carModel->delete($id)) {
            ApiResponse::error('Failed to delete car', 500);
        }

        ApiResponse::success(null, 'Car deleted successfully');
    }

    private function validateImageUrl(&$errors) {
        $imageUrl = trim($this->request['image_url'] ?? '');
        if ($imageUrl === '') {
            return;
        }

        if (strlen($imageUrl) > 500 || !preg_match('~^(https?://|/assets/|/uploads/)~i', $imageUrl)) {
            $errors['image_url'] = 'Use an http(s) URL or a path beginning with /assets/ or /uploads/.';
        }
    }
}
