<?php
/**
 * CARTHAGE DRIVE - API Response Handler
 * Provides consistent API response format
 */

class ApiResponse {
    
    /**
     * Send success response
     */
    public static function success($data = null, $message = 'Success', $statusCode = 200) {
        http_response_code($statusCode);
        return self::send([
            'status' => 'success',
            'message' => $message,
            'data' => $data
        ]);
    }

    /**
     * Send error response
     */
    public static function error($message = 'Error', $statusCode = 400, $errors = null) {
        http_response_code($statusCode);
        return self::send([
            'status' => 'error',
            'message' => $message,
            'errors' => $errors
        ]);
    }

    /**
     * Send paginated response
     */
    public static function paginated($data, $total, $page, $perPage, $message = 'Success', $statusCode = 200) {
        http_response_code($statusCode);
        return self::send([
            'status' => 'success',
            'message' => $message,
            'data' => $data,
            'pagination' => [
                'total' => (int)$total,
                'page' => (int)$page,
                'per_page' => (int)$perPage,
                'total_pages' => ceil($total / $perPage)
            ]
        ]);
    }

    /**
     * Send validation error response
     */
    public static function validationError($errors, $statusCode = 422) {
        http_response_code($statusCode);
        return self::send([
            'status' => 'error',
            'message' => 'Validation failed',
            'errors' => $errors
        ]);
    }

    /**
     * Send unauthorized response
     */
    public static function unauthorized($message = 'Unauthorized', $statusCode = 401) {
        http_response_code($statusCode);
        return self::send([
            'status' => 'error',
            'message' => $message
        ]);
    }

    /**
     * Send forbidden response
     */
    public static function forbidden($message = 'Forbidden', $statusCode = 403) {
        http_response_code($statusCode);
        return self::send([
            'status' => 'error',
            'message' => $message
        ]);
    }

    /**
     * Send not found response
     */
    public static function notFound($message = 'Resource not found', $statusCode = 404) {
        http_response_code($statusCode);
        return self::send([
            'status' => 'error',
            'message' => $message
        ]);
    }

    /**
     * Send server error response
     */
    public static function serverError($message = 'Internal server error', $statusCode = 500) {
        http_response_code($statusCode);
        return self::send([
            'status' => 'error',
            'message' => $message
        ]);
    }

    /**
     * Internal method to send JSON response
     */
    private static function send($data) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit();
    }
}
