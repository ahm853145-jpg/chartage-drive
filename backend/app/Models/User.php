<?php
/**
 * CARTHAGE DRIVE - User Model
 * Handles database operations for users
 */

class User {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    /**
     * Find user by ID
     */
    public function findById($id) {
        $this->db->prepare('
            SELECT id, first_name, last_name, email, phone, role, status, created_at, updated_at
            FROM users
            WHERE id = :id AND status = "ACTIVE"
        ');
        $this->db->bind(':id', $id);
        return $this->db->single();
    }

    /**
     * Find user by email
     */
    public function findByEmail($email) {
        $this->db->prepare('
            SELECT id, first_name, last_name, email, phone, password, role, status, created_at, updated_at
            FROM users
            WHERE email = :email
        ');
        $this->db->bind(':email', $email);
        return $this->db->single();
    }

    /**
     * Check if email exists
     */
    public function emailExists($email) {
        $this->db->prepare('
            SELECT id FROM users WHERE email = :email LIMIT 1
        ');
        $this->db->bind(':email', $email);
        return $this->db->single() !== false;
    }

    /**
     * Create new user
     */
    public function create($data) {
        $this->db->prepare('
            INSERT INTO users (first_name, last_name, email, phone, password, role, status)
            VALUES (:first_name, :last_name, :email, :phone, :password, :role, :status)
        ');
        
        $this->db->bind(':first_name', $data['first_name']);
        $this->db->bind(':last_name', $data['last_name']);
        $this->db->bind(':email', $data['email']);
        $this->db->bind(':phone', $data['phone'] ?? null);
        $this->db->bind(':password', $data['password']);
        $this->db->bind(':role', $data['role'] ?? 'CLIENT');
        $this->db->bind(':status', 'ACTIVE');
        
        if ($this->db->execute()) {
            return $this->db->lastInsertId();
        }
        
        return false;
    }

    /**
     * Update user profile
     */
    public function update($id, $data) {
        $this->db->prepare('
            UPDATE users
            SET first_name = :first_name,
                last_name = :last_name,
                phone = :phone,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = :id
        ');
        
        $this->db->bind(':id', $id);
        $this->db->bind(':first_name', $data['first_name']);
        $this->db->bind(':last_name', $data['last_name']);
        $this->db->bind(':phone', $data['phone'] ?? null);
        
        return $this->db->execute();
    }

    /** Update account details and access state from the admin panel. */
    public function adminUpdate($id, $data) {
        $this->db->prepare('
            UPDATE users
            SET first_name = :first_name,
                last_name = :last_name,
                email = :email,
                phone = :phone,
                role = :role,
                status = :status,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = :id
        ');

        $this->db->bind(':id', (int)$id, PDO::PARAM_INT);
        $this->db->bind(':first_name', $data['first_name']);
        $this->db->bind(':last_name', $data['last_name']);
        $this->db->bind(':email', $data['email']);
        $this->db->bind(':phone', $data['phone'] ?? null);
        $this->db->bind(':role', $data['role']);
        $this->db->bind(':status', $data['status']);

        return $this->db->execute();
    }

    /** Find an account for admin actions, including inactive accounts. */
    public function findByIdForAdmin($id) {
        $this->db->prepare('
            SELECT id, first_name, last_name, email, phone, role, status, created_at, updated_at
            FROM users WHERE id = :id LIMIT 1
        ');
        $this->db->bind(':id', (int)$id, PDO::PARAM_INT);
        return $this->db->single();
    }

    public function emailExistsForAnotherUser($email, $id) {
        $this->db->prepare('SELECT id FROM users WHERE email = :email AND id != :id LIMIT 1');
        $this->db->bind(':email', $email);
        $this->db->bind(':id', (int)$id, PDO::PARAM_INT);
        return $this->db->single() !== false;
    }

    public function setStatus($id, $status) {
        $this->db->prepare('UPDATE users SET status = :status, updated_at = CURRENT_TIMESTAMP WHERE id = :id');
        $this->db->bind(':status', $status);
        $this->db->bind(':id', (int)$id, PDO::PARAM_INT);
        return $this->db->execute();
    }

    /**
     * Update password
     */
    public function updatePassword($id, $newPassword) {
        $this->db->prepare('
            UPDATE users
            SET password = :password, updated_at = CURRENT_TIMESTAMP
            WHERE id = :id
        ');
        
        $this->db->bind(':id', $id);
        $this->db->bind(':password', $newPassword);
        
        return $this->db->execute();
    }

    /**
     * Get all users (for admin)
     */
    public function getAll($page = 1, $perPage = 10) {
        $offset = ($page - 1) * $perPage;
        
        $this->db->prepare('
            SELECT id, first_name, last_name, email, phone, role, status, created_at
            FROM users
            ORDER BY created_at DESC
            LIMIT :limit OFFSET :offset
        ');
        
        $this->db->bind(':limit', $perPage, PDO::PARAM_INT);
        $this->db->bind(':offset', $offset, PDO::PARAM_INT);
        
        return $this->db->resultSet();
    }

    /**
     * Get total user count
     */
    public function getTotalCount() {
        $this->db->prepare('SELECT COUNT(*) as count FROM users');
        $result = $this->db->single();
        return $result['count'] ?? 0;
    }

    /**
     * Deactivate user
     */
    public function deactivate($id) {
        $this->db->prepare('
            UPDATE users
            SET status = "INACTIVE", updated_at = CURRENT_TIMESTAMP
            WHERE id = :id
        ');
        
        $this->db->bind(':id', $id);
        
        return $this->db->execute();
    }

    /**
     * Get user booking count
     */
    public function getBookingCount($userId) {
        $this->db->prepare('
            SELECT COUNT(*) as count
            FROM bookings
            WHERE user_id = :user_id AND status IN ("CONFIRMED", "COMPLETED")
        ');
        
        $this->db->bind(':user_id', $userId);
        $result = $this->db->single();
        
        return $result['count'] ?? 0;
    }
}
