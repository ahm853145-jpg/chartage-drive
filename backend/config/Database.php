<?php
/**
 * CARTHAGE DRIVE - Database Connection Class
 * Handles database connections and provides query methods
 */

class Database {
    private $host;
    private $port;
    private $database;
    private $username;
    private $password;
    private $connection;
    private $statement;

    public function __construct($host, $port, $database, $username, $password) {
        $this->host = $host;
        $this->port = $port;
        $this->database = $database;
        $this->username = $username;
        $this->password = $password;
        $this->connect();
    }

    /**
     * Connect to MySQL database
     */
    private function connect() {
        $dsn = "mysql:host=" . $this->host . ";port=" . $this->port . ";dbname=" . $this->database;
        
        try {
            $this->connection = new PDO(
                $dsn,
                $this->username,
                $this->password,
                [
                    PDO::ATTR_PERSISTENT => false,
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
                ]
            );
            // Set charset to UTF-8
            $this->connection->exec("SET NAMES utf8mb4");
        } catch (PDOException $e) {
            error_log('Database connection failed: ' . $e->getMessage());
            die(json_encode([
                'status' => 'error',
                'message' => 'Database connection failed'
            ]));
        }
    }

    /**
     * Prepare a statement
     */
    public function prepare($sql) {
        $this->statement = $this->connection->prepare($sql);
        return $this;
    }

    /**
     * Bind parameters
     */
    public function bind($param, $value, $type = null) {
        if (is_null($type)) {
            switch (true) {
                case is_int($value):
                    $type = PDO::PARAM_INT;
                    break;
                case is_bool($value):
                    $type = PDO::PARAM_BOOL;
                    break;
                case is_null($value):
                    $type = PDO::PARAM_NULL;
                    break;
                default:
                    $type = PDO::PARAM_STR;
            }
        }
        $this->statement->bindValue($param, $value, $type);
        return $this;
    }

    /**
     * Execute query
     */
    public function execute() {
        try {
            return $this->statement->execute();
        } catch (PDOException $e) {
            throw new Exception("Query execution failed: " . $e->getMessage());
        }
    }

    /**
     * Get single row
     */
    public function single() {
        $this->execute();
        return $this->statement->fetch();
    }

    /**
     * Get all rows
     */
    public function resultSet() {
        $this->execute();
        return $this->statement->fetchAll();
    }

    /**
     * Get row count
     */
    public function rowCount() {
        return $this->statement->rowCount();
    }

    /**
     * Get last inserted ID
     */
    public function lastInsertId() {
        return $this->connection->lastInsertId();
    }

    /**
     * Begin transaction
     */
    public function beginTransaction() {
        return $this->connection->beginTransaction();
    }

    /**
     * Commit transaction
     */
    public function commit() {
        return $this->connection->commit();
    }

    /**
     * Rollback transaction
     */
    public function rollback() {
        return $this->connection->rollback();
    }

    /**
     * Get connection object
     */
    public function getConnection() {
        return $this->connection;
    }
}
