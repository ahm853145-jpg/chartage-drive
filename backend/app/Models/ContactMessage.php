<?php
/**
 * CARTHAGE DRIVE - Contact Message Model
 * Handles database operations for contact messages
 */

class ContactMessage {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    /**
     * Create new contact message
     */
    public function create($data) {
        $this->db->prepare('
            INSERT INTO contact_messages (name, email, phone, subject, message, status)
            VALUES (:name, :email, :phone, :subject, :message, :status)
        ');

        $this->db->bind(':name', $data['name']);
        $this->db->bind(':email', $data['email']);
        $this->db->bind(':phone', $data['phone'] ?? null);
        $this->db->bind(':subject', $data['subject']);
        $this->db->bind(':message', $data['message']);
        $this->db->bind(':status', 'NEW');

        if ($this->db->execute()) {
            return $this->db->lastInsertId();
        }

        return false;
    }

    /**
     * Get all messages (admin)
     */
    public function getAll($filters = [], $page = 1, $perPage = 10) {
        $query = 'SELECT * FROM contact_messages WHERE 1=1';

        if (!empty($filters['status'])) {
            $query .= ' AND status = :status';
        }

        $query .= ' ORDER BY created_at DESC';

        $offset = ($page - 1) * $perPage;
        $query .= ' LIMIT :limit OFFSET :offset';

        $this->db->prepare($query);

        if (!empty($filters['status'])) {
            $this->db->bind(':status', $filters['status']);
        }

        $this->db->bind(':limit', $perPage, PDO::PARAM_INT);
        $this->db->bind(':offset', $offset, PDO::PARAM_INT);

        return $this->db->resultSet();
    }

    /**
     * Get message by ID
     */
    public function findById($id) {
        $this->db->prepare('SELECT * FROM contact_messages WHERE id = :id');
        $this->db->bind(':id', $id);
        return $this->db->single();
    }

    /**
     * Update message status
     */
    public function updateStatus($id, $status) {
        $this->db->prepare('
            UPDATE contact_messages SET status = :status WHERE id = :id
        ');

        $this->db->bind(':id', $id);
        $this->db->bind(':status', $status);

        return $this->db->execute();
    }

    /**
     * Get total count
     */
    public function getTotalCount($filters = []) {
        $query = 'SELECT COUNT(*) as count FROM contact_messages WHERE 1=1';

        if (!empty($filters['status'])) {
            $query .= ' AND status = :status';
        }

        $this->db->prepare($query);

        if (!empty($filters['status'])) {
            $this->db->bind(':status', $filters['status']);
        }

        $result = $this->db->single();
        return $result['count'] ?? 0;
    }
}
