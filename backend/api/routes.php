<?php
/**
 * CARTHAGE DRIVE - API Routes
 * Main routing handler for all API requests
 */

class Router {
    private $routes = [];
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    /**
     * Register a route
     */
    public function register($method, $path, $controller, $action) {
        $this->routes[] = [
            'method' => strtoupper($method),
            'path' => $path,
            'controller' => $controller,
            'action' => $action
        ];
    }

    /**
     * Match and handle request
     */
    public function handle() {
        $method = $_SERVER['REQUEST_METHOD'];
        $requestPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

        // Remove base path
        $basePath = '/carthage-drive-backend/api';
        $path = str_replace($basePath, '', $requestPath);
        if (empty($path)) {
            $path = '/';
        }

        foreach ($this->routes as $route) {
            if ($this->pathMatches($path, $route['path']) && $route['method'] === $method) {
                return $this->executeRoute($route, $path);
            }
        }

        ApiResponse::notFound('Endpoint not found');
    }

    /**
     * Check if path matches route pattern
     */
    private function pathMatches($path, $pattern) {
        // Convert /users/:id to regex
        $pattern = preg_replace('/:[a-zA-Z_]+/', '([^/]+)', $pattern);
        $pattern = '^' . $pattern . '$';

        return preg_match('~' . $pattern . '~', $path);
    }

    /**
     * Extract path parameters
     */
    private function extractParams($path, $pattern) {
        $pattern = preg_replace('/:[a-zA-Z_]+/', '([^/]+)', $pattern);
        $pattern = '^' . $pattern . '$';

        $matches = [];
        if (preg_match('~' . $pattern . '~', $path, $matches)) {
            array_shift($matches); // Remove full match
            return $matches;
        }

        return [];
    }

    /**
     * Execute route
     */
    private function executeRoute($route, $path) {
        $controllerName = $route['controller'];
        $actionName = $route['action'];
        $controllerFile = dirname(__DIR__) . '/app/Controllers/' . $controllerName . '.php';

        if (!file_exists($controllerFile)) {
            ApiResponse::serverError('Controller not found: ' . $controllerName);
        }

        require_once $controllerFile;

        $controller = new $controllerName($this->db);
        $params = $this->extractParams($path, $route['path']);

        if (method_exists($controller, $actionName)) {
            call_user_func_array([$controller, $actionName], $params);
        } else {
            ApiResponse::serverError('Action not found: ' . $actionName);
        }
    }
}

// Create database connection
require_once dirname(__DIR__) . '/config/Database.php';
require_once dirname(__DIR__) . '/config/Config.php';

Config::load();

$db = new Database(
    Config::get('DB_HOST'),
    Config::get('DB_PORT'),
    Config::get('DB_DATABASE'),
    Config::get('DB_USERNAME'),
    Config::get('DB_PASSWORD')
);

// Initialize JWT with secret
require_once dirname(__DIR__) . '/app/JwtHelper.php';
JwtHelper::init(
    Config::get('JWT_SECRET'),
    Config::get('JWT_ALGORITHM'),
    (int)Config::get('JWT_EXPIRATION')
);

// Load API response class
require_once dirname(__DIR__) . '/app/ApiResponse.php';

// Load base controller
require_once dirname(__DIR__) . '/app/BaseController.php';

// Load all models
require_once dirname(__DIR__) . '/app/Models/User.php';
require_once dirname(__DIR__) . '/app/Models/Car.php';
require_once dirname(__DIR__) . '/app/Models/Booking.php';
require_once dirname(__DIR__) . '/app/Models/ContactMessage.php';

// Setup CORS. A response may only contain one allowed origin; never echo an
// unvalidated Origin header or a comma-separated configuration value.
$allowedOrigins = array_filter(array_map('trim', explode(',', Config::get('CORS_ALLOWED_ORIGINS', ''))));
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin && in_array($origin, $allowedOrigins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
}
header('Access-Control-Allow-Methods: ' . Config::get('CORS_ALLOWED_METHODS', 'GET,POST,PUT,DELETE,OPTIONS'));
header('Access-Control-Allow-Headers: ' . Config::get('CORS_ALLOWED_HEADERS', 'Content-Type,Authorization'));
header('Access-Control-Max-Age: 600');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

// Create router
$router = new Router($db);

// Authentication routes
$router->register('POST', '/auth/register', 'AuthController', 'register');
$router->register('POST', '/auth/login', 'AuthController', 'login');
$router->register('POST', '/auth/logout', 'AuthController', 'logout');

// Cars routes
$router->register('GET', '/cars', 'CarController', 'getAll');
$router->register('GET', '/cars/:id', 'CarController', 'getById');
$router->register('POST', '/cars', 'CarController', 'create');
$router->register('PUT', '/cars/:id', 'CarController', 'update');
$router->register('DELETE', '/cars/:id', 'CarController', 'delete');

// Bookings routes
$router->register('GET', '/bookings', 'BookingController', 'getAll');
$router->register('GET', '/bookings/:id', 'BookingController', 'getById');
$router->register('POST', '/bookings', 'BookingController', 'create');
$router->register('PUT', '/bookings/:id', 'BookingController', 'update');
$router->register('DELETE', '/bookings/:id', 'BookingController', 'cancel');

// Users routes
$router->register('GET', '/users/:id', 'UserController', 'getProfile');
$router->register('PUT', '/users/:id', 'UserController', 'updateProfile');
$router->register('PUT', '/users/:id/password', 'UserController', 'changePassword');

// Admin routes
$router->register('GET', '/admin/dashboard', 'AdminController', 'dashboard');
$router->register('GET', '/admin/users', 'AdminController', 'getUsers');
$router->register('PUT', '/admin/users/:id', 'AdminController', 'updateUser');
$router->register('DELETE', '/admin/users/:id', 'AdminController', 'deactivateUser');
$router->register('GET', '/admin/bookings', 'AdminController', 'getBookings');
$router->register('PUT', '/admin/bookings/:id', 'AdminController', 'updateBooking');

// Contact routes
$router->register('POST', '/contact', 'ContactController', 'submit');

// Handle request
$router->handle();
