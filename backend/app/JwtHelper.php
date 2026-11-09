<?php
/**
 * CARTHAGE DRIVE - JWT Helper
 * Handles JWT token creation and validation
 */

class JwtHelper {
    private static $algorithm = 'HS256';
    private static $secret = null;
    private static $expiration = 86400; // 24 hours

    /**
     * Initialize JWT helper with secret
     */
    public static function init($secret, $algorithm = 'HS256', $expiration = 86400) {
        self::$secret = $secret;
        self::$algorithm = $algorithm;
        self::$expiration = $expiration;
    }

    /**
     * Create JWT token
     */
    public static function encode($payload = []) {
        if (empty(self::$secret)) {
            throw new Exception('JWT secret not initialized');
        }

        // Add expiration
        $payload['exp'] = time() + self::$expiration;
        $payload['iat'] = time();

        // Base64url encode header
        $header = [
            'alg' => self::$algorithm,
            'typ' => 'JWT'
        ];
        
        $headerEncoded = self::base64UrlEncode(json_encode($header));
        $payloadEncoded = self::base64UrlEncode(json_encode($payload));

        // Create signature
        $signature = hash_hmac(
            'sha256',
            "{$headerEncoded}.{$payloadEncoded}",
            self::$secret,
            true
        );
        $signatureEncoded = self::base64UrlEncode($signature);

        return "{$headerEncoded}.{$payloadEncoded}.{$signatureEncoded}";
    }

    /**
     * Decode and verify JWT token
     */
    public static function decode($token) {
        if (empty(self::$secret)) {
            throw new Exception('JWT secret not initialized');
        }

        $parts = explode('.', $token);
        
        if (count($parts) !== 3) {
            return false;
        }

        list($headerEncoded, $payloadEncoded, $signatureEncoded) = $parts;

        // Verify signature
        $signature = hash_hmac(
            'sha256',
            "{$headerEncoded}.{$payloadEncoded}",
            self::$secret,
            true
        );
        $signatureExpected = self::base64UrlEncode($signature);

        if (!hash_equals($signatureExpected, $signatureEncoded)) {
            return false;
        }

        // Decode payload
        $payload = json_decode(self::base64UrlDecode($payloadEncoded), true);

        // Check expiration
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            return false;
        }

        return $payload;
    }

    /**
     * Base64url encode
     */
    private static function base64UrlEncode($data) {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    /**
     * Base64url decode
     */
    private static function base64UrlDecode($data) {
        $remainder = strlen($data) % 4;
        if ($remainder) {
            $data .= str_repeat('=', 4 - $remainder);
        }
        return base64_decode(strtr($data, '-_', '+/'));
    }

    /**
     * Get token from Authorization header
     */
    public static function getTokenFromHeader() {
        $headers = function_exists('getallheaders') ? getallheaders() : [];

        foreach ($headers as $name => $value) {
            if (strtolower($name) === 'authorization' && stripos($value, 'Bearer ') === 0) {
                return substr($value, 7);
            }
        }

        $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
        if (stripos($authHeader, 'Bearer ') === 0) {
            return substr($authHeader, 7);
        }

        return null;
    }

    /**
     * Verify token from Authorization header
     */
    public static function verifyToken() {
        $token = self::getTokenFromHeader();
        
        if (!$token) {
            return false;
        }

        return self::decode($token);
    }
}
