<?php
/**
 * CARTHAGE DRIVE - Auth Controller
 * Handles user authentication (login, register, logout)
 */

class AuthController extends BaseController {

    /**
     * Register new user
     * POST /api/auth/register
     */
    public function register() {
        if (!$this->isPost()) {
            ApiResponse::error('Method not allowed', 405);
        }

        // Validate input
        $rules = [
            'first_name' => 'required|min:2|max:100',
            'last_name' => 'required|min:2|max:100',
            'email' => 'required|email|max:255',
            'phone' => 'required|min:8|max:20',
            'password' => 'required|min:6|max:255',
            'password_confirm' => 'required'
        ];

        $errors = $this->validate($this->request, $rules);

        if (!empty($errors)) {
            ApiResponse::validationError($errors);
        }

        // Check password confirmation
        if ($this->request['password'] !== $this->request['password_confirm']) {
            ApiResponse::validationError(['password' => 'Passwords do not match']);
        }

        // Check if email already exists
        $userModel = new User($this->db);
        if ($userModel->emailExists($this->request['email'])) {
            ApiResponse::validationError(['email' => 'Email already registered']);
        }

        // Hash password
        $hashedPassword = $this->hashPassword($this->request['password']);

        // Create user
        $userData = [
            'first_name' => $this->request['first_name'],
            'last_name' => $this->request['last_name'],
            'email' => $this->request['email'],
            'phone' => $this->request['phone'],
            'password' => $hashedPassword,
            'role' => 'CLIENT'
        ];

        $userId = $userModel->create($userData);

        if (!$userId) {
            ApiResponse::error('Failed to create user', 500);
        }

        // Get created user
        $user = $userModel->findById($userId);

        ApiResponse::success($user, 'User registered successfully', 201);
    }

    /**
     * Login user
     * POST /api/auth/login
     */
    public function login() {
        if (!$this->isPost()) {
            ApiResponse::error('Method not allowed', 405);
        }

        // Validate input
        $rules = [
            'email' => 'required|email',
            'password' => 'required|min:6'
        ];

        $errors = $this->validate($this->request, $rules);

        if (!empty($errors)) {
            ApiResponse::validationError($errors);
        }

        // Find user by email
        $userModel = new User($this->db);
        $user = $userModel->findByEmail($this->request['email']);

        if (!$user) {
            ApiResponse::error('Invalid email or password', 401);
        }

        // Check password
        if (!$this->verifyPassword($this->request['password'], $user['password'])) {
            ApiResponse::error('Invalid email or password', 401);
        }

        // Check status
        if ($user['status'] !== 'ACTIVE') {
            ApiResponse::error('Account is not active', 403);
        }

        // Generate JWT token
        $payload = [
            'id' => $user['id'],
            'email' => $user['email'],
            'role' => $user['role'],
            'first_name' => $user['first_name'],
            'last_name' => $user['last_name']
        ];

        $token = JwtHelper::encode($payload);

        // Return user data with token
        $userData = [
            'id' => $user['id'],
            'first_name' => $user['first_name'],
            'last_name' => $user['last_name'],
            'email' => $user['email'],
            'phone' => $user['phone'],
            'role' => $user['role'],
            'token' => $token
        ];

        ApiResponse::success($userData, 'Login successful');
    }

    /**
     * Logout user
     * POST /api/auth/logout
     */
    public function logout() {
        if (!$this->isPost()) {
            ApiResponse::error('Method not allowed', 405);
        }

        $this->requireAuth();

        // In a stateless JWT system, logout is handled on the client side
        // by removing the token. This endpoint is mainly for logging purposes.

        ApiResponse::success(null, 'Logout successful');
    }
}
