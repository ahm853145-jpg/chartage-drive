<?php
/**
 * CARTHAGE DRIVE - Base Controller
 * Provides common functionality for all controllers
 */

class BaseController {
    protected $db;
    protected $request;
    protected $user = null;

    public function __construct($db) {
        $this->db = $db;
        $this->request = $this->getRequest();
        $this->authenticateUser();
    }

    /**
     * Get request data (JSON or form data)
     */
    protected function getRequest() {
        $input = file_get_contents('php://input');
        if ($input !== '') {
            $json = json_decode($input, true);
            if (is_array($json)) {
                return $json;
            }

            parse_str($input, $formData);
            if (!empty($formData)) {
                return $formData;
            }
        }

        return $_POST ?: ($_REQUEST ?? []);
    }

    /**
     * Authenticate user from JWT token
     */
    protected function authenticateUser() {
        $payload = JwtHelper::verifyToken();

        if (!$payload || empty($payload['id'])) {
            return;
        }

        // The signed token authenticates the user ID; the database remains the
        // source of truth for current role and account status.
        $this->db->prepare('SELECT id, email, role, status FROM users WHERE id = :id LIMIT 1');
        $this->db->bind(':id', (int)$payload['id'], PDO::PARAM_INT);
        $user = $this->db->single();

        if ($user && $user['status'] === 'ACTIVE') {
            $this->user = $user;
        }
    }

    /**
     * Check if user is authenticated
     */
    protected function isAuthenticated() {
        return !is_null($this->user);
    }

    /**
     * Check if user is admin
     */
    protected function isAdmin() {
        return $this->isAuthenticated() && ($this->user['role'] ?? null) === 'ADMIN';
    }

    /**
     * Get authenticated user ID
     */
    protected function getUserId() {
        return $this->user['id'] ?? null;
    }

    /**
     * Require authentication
     */
    protected function requireAuth() {
        if (!$this->isAuthenticated()) {
            ApiResponse::unauthorized('Authentication required');
        }
    }

    /**
     * Require admin role
     */
    protected function requireAdmin() {
        if (!$this->isAuthenticated()) {
            ApiResponse::unauthorized('Your session has expired. Please sign in again.');
        }

        if (!$this->isAdmin()) {
            ApiResponse::forbidden('Admin access required');
        }
    }

    /**
     * Get request parameter
     */
    protected function getParam($key, $default = null) {
        return $this->request[$key] ?? $default;
    }

    /**
     * Get request parameters
     */
    protected function getParams() {
        return $this->request;
    }

    /**
     * Validate required fields
     */
    protected function validate($data, $rules) {
        $errors = [];

        foreach ($rules as $field => $fieldRules) {
            $rules = explode('|', $fieldRules);
            $value = $data[$field] ?? null;

            foreach ($rules as $rule) {
                $this->validateField($field, $value, $rule, $errors);
            }
        }

        return $errors;
    }

    /**
     * Validate single field
     */
    private function validateField($field, $value, $rule, &$errors) {
        $rule = trim($rule);

        if ($rule === 'required' && empty($value)) {
            $errors[$field] = "{$field} is required";
        } elseif (strpos($rule, 'min:') === 0 && !empty($value)) {
            $min = substr($rule, 4);
            if (strlen($value) < $min) {
                $errors[$field] = "{$field} must be at least {$min} characters";
            }
        } elseif (strpos($rule, 'max:') === 0 && !empty($value)) {
            $max = substr($rule, 4);
            if (strlen($value) > $max) {
                $errors[$field] = "{$field} must not exceed {$max} characters";
            }
        } elseif ($rule === 'email' && !empty($value)) {
            if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
                $errors[$field] = "{$field} must be a valid email";
            }
        } elseif ($rule === 'numeric' && !empty($value)) {
            if (!is_numeric($value)) {
                $errors[$field] = "{$field} must be numeric";
            }
        } elseif (strpos($rule, 'regex:') === 0 && !empty($value)) {
            $pattern = substr($rule, 6);
            if (!preg_match($pattern, $value)) {
                $errors[$field] = "{$field} format is invalid";
            }
        }
    }

    /**
     * Hash password
     */
    protected function hashPassword($password) {
        return password_hash($password, PASSWORD_BCRYPT, [
            'cost' => (int)Config::get('BCRYPT_ROUNDS', 10)
        ]);
    }

    /**
     * Verify password
     */
    protected function verifyPassword($password, $hash) {
        return password_verify($password, $hash);
    }

    /**
     * Generate unique booking number
     */
    protected function generateBookingNumber() {
        $date = date('Ymd');
        $random = strtoupper(substr(bin2hex(random_bytes(4)), 0, 6));
        return "BK{$date}{$random}";
    }

    /**
     * Get method (GET, POST, PUT, DELETE, etc.)
     */
    protected function getMethod() {
        return $_SERVER['REQUEST_METHOD'] ?? 'GET';
    }

    /**
     * Check if request method is GET
     */
    protected function isGet() {
        return $this->getMethod() === 'GET';
    }

    /**
     * Check if request method is POST
     */
    protected function isPost() {
        return $this->getMethod() === 'POST';
    }

    /**
     * Check if request method is PUT
     */
    protected function isPut() {
        return $this->getMethod() === 'PUT';
    }

    /**
     * Check if request method is DELETE
     */
    protected function isDelete() {
        return $this->getMethod() === 'DELETE';
    }
}
