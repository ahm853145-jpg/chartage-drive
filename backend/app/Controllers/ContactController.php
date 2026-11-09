<?php
/**
 * CARTHAGE DRIVE - Contact Controller
 * Handles contact form submissions
 */

class ContactController extends BaseController {

    /**
     * Submit contact form
     * POST /api/contact
     */
    public function submit() {
        if (!$this->isPost()) {
            ApiResponse::error('Method not allowed', 405);
        }

        // Validate input
        $rules = [
            'name' => 'required|min:2|max:100',
            'email' => 'required|email',
            'subject' => 'required|min:5|max:255',
            'message' => 'required|min:10'
        ];

        $errors = $this->validate($this->request, $rules);

        if (!empty($errors)) {
            ApiResponse::validationError($errors);
        }

        // Phone is optional but validate if provided
        if (isset($this->request['phone']) && !empty($this->request['phone'])) {
            if (strlen($this->request['phone']) < 8 || strlen($this->request['phone']) > 20) {
                ApiResponse::validationError(['phone' => 'Phone number must be between 8 and 20 characters']);
            }
        }

        // Create contact message
        $contactModel = new ContactMessage($this->db);
        $messageId = $contactModel->create($this->request);

        if (!$messageId) {
            ApiResponse::error('Failed to submit message', 500);
        }

        // TODO: Send email notification to admin

        $message = $contactModel->findById($messageId);

        ApiResponse::success($message, 'Your message has been sent successfully. We will contact you soon.', 201);
    }
}
