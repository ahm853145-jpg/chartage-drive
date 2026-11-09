<?php
/**
 * CARTHAGE DRIVE - API Entry Point
 * This is the main index.php file that handles all API requests
 * 
 * Place this file in: /htdocs/carthage-drive-backend/index.php
 * Access via: http://localhost/carthage-drive-backend/api/...
 */

// Set error handling
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/logs/error.log');

// Create logs directory if it doesn't exist
$logsDir = __DIR__ . '/logs';
if (!is_dir($logsDir)) {
    mkdir($logsDir, 0755, true);
}

// Define base directory
define('BASE_DIR', __DIR__);

// Load routing
require_once BASE_DIR . '/api/routes.php';
