<?php
/**
 * CARTHAGE DRIVE - User Controller
 * Handles user profile operations
 */

class UserController extends BaseController {

    /**
     * Get user profile
     * GET /api/users/:id
     */
    public function getProfile($id) {
        if (!$this->isGet()) {
            ApiResponse::error('Method not allowed', 405);
        }

        $this->requireAuth();

        // Check authorization (user can only view own profile unless admin)
        if (!$this->isAdmin() && $this->getUserId() != $id) {
            ApiResponse::forbidden('You cannot access this profile');
        }

        $userModel = new User($this->db);
        $user = $userModel->findById($id);

        if (!$user) {
            ApiResponse::notFound('User not found');
        }

        // Add booking count
        $user['booking_count'] = $userModel->getBookingCount($id);

        ApiResponse::success($user, 'Profile retrieved successfully');
    }

    /**
     * Update user profile
     * PUT /api/users/:id
     */
    public function updateProfile($id) {
        if (!$this->isPut()) {
            ApiResponse::error('Method not allowed', 405);
        }

        $this->requireAuth();

        // Check authorization
        if (!$this->isAdmin() && $this->getUserId() != $id) {
            ApiResponse::forbidden('You cannot modify this profile');
        }

        // Validate input
        $rules = [
            'first_name' => 'required|min:2|max:100',
            'last_name' => 'required|min:2|max:100',
            'phone' => 'required|min:8|max:20'
        ];

        $errors = $this->validate($this->request, $rules);

        if (!empty($errors)) {
            ApiResponse::validationError($errors);
        }

        $userModel = new User($this->db);
        $user = $userModel->findById($id);

        if (!$user) {
            ApiResponse::notFound('User not found');
        }

        // Update profile
        $updateData = [
            'first_name' => $this->request['first_name'],
            'last_name' => $this->request['last_name'],
            'phone' => $this->request['phone']
        ];

        if (!$userModel->update($id, $updateData)) {
            ApiResponse::error('Failed to update profile', 500);
        }

        $updatedUser = $userModel->findById($id);

        ApiResponse::success($updatedUser, 'Profile updated successfully');
    }

    /**
     * Change user password
     * PUT /api/users/:id/password
     */
    public function changePassword($id) {
        if (!$this->isPut()) {
            ApiResponse::error('Method not allowed', 405);
        }

        $this->requireAuth();

        // Check authorization
        if (!$this->isAdmin() && $this->getUserId() != $id) {
            ApiResponse::forbidden('You cannot change this password');
        }

        // Validate input
        $rules = [
            'current_password' => 'required|min:6',
            'new_password' => 'required|min:6|max:255',
            'new_password_confirm' => 'required'
        ];

        $errors = $this->validate($this->request, $rules);

        if (!empty($errors)) {
            ApiResponse::validationError($errors);
        }

        // Check password confirmation
        if ($this->request['new_password'] !== $this->request['new_password_confirm']) {
            ApiResponse::validationError(['new_password' => 'Passwords do not match']);
        }

        $userModel = new User($this->db);
        $user = $userModel->findByEmail($this->user['email']);

        if (!$user) {
            ApiResponse::notFound('User not found');
        }

        // Verify current password (unless admin)
        if (!$this->isAdmin()) {
            if (!$this->verifyPassword($this->request['current_password'], $user['password'])) {
                ApiResponse::error('Current password is incorrect', 401);
            }
        }

        // Hash new password
        $hashedPassword = $this->hashPassword($this->request['new_password']);

        // Update password
        if (!$userModel->updatePassword($id, $hashedPassword)) {
            ApiResponse::error('Failed to update password', 500);
        }

        ApiResponse::success(null, 'Password updated successfully');
    }
}
