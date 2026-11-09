<?php
/**
 * CARTHAGE DRIVE - Configuration Loader
 * Loads environment variables from .env file
 */

class Config {
    private static $env = [];
    private static $loaded = false;

    /**
     * Load environment variables from .env file
     */
    public static function load($filePath = null) {
        if (self::$loaded) {
            return;
        }

        if (is_null($filePath)) {
            $filePath = dirname(__DIR__) . '/.env';
        }

        if (!file_exists($filePath)) {
            throw new Exception("Configuration file not found: " . $filePath);
        }

        $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        
        foreach ($lines as $line) {
            // Skip comments
            if (strpos(trim($line), '#') === 0) {
                continue;
            }

            // Parse KEY=VALUE
            if (strpos($line, '=') !== false) {
                list($key, $value) = explode('=', $line, 2);
                $key = trim($key);
                $value = trim($value);
                
                // Remove quotes if present
                if ((strpos($value, '"') === 0 && strrpos($value, '"') === strlen($value) - 1)) {
                    $value = substr($value, 1, -1);
                }
                
                self::$env[$key] = $value;
                putenv("{$key}={$value}");
            }
        }

        self::$loaded = true;
    }

    /**
     * Get configuration value
     */
    public static function get($key, $default = null) {
        if (!self::$loaded) {
            self::load();
        }
        
        return isset(self::$env[$key]) ? self::$env[$key] : $default;
    }

    /**
     * Set configuration value
     */
    public static function set($key, $value) {
        self::$env[$key] = $value;
        putenv("{$key}={$value}");
    }

    /**
     * Get all configuration
     */
    public static function all() {
        if (!self::$loaded) {
            self::load();
        }
        return self::$env;
    }

    /**
     * Check if configuration key exists
     */
    public static function has($key) {
        if (!self::$loaded) {
            self::load();
        }
        return isset(self::$env[$key]);
    }
}

// Load environment variables on initialization
Config::load();
