// src/routes/dashboard.route.js
const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');

const router = express.Router();

// Admin Dashboard (accessible only if authenticated and admin)
router.get('/admin', verifyToken, verifyAdmin, (req, res) => {
  res.status(200).json({
    message: `Welcome to the admin dashboard, ${req.user.username}`,
  });
});

// Manage Products (admin only)
router.get('/manage-products', verifyToken, verifyAdmin, (req, res) => {
  res.status(200).json({
    message: 'Manage your products here.',
  });
});

// Manage Orders (admin only)
router.get('/manage-orders', verifyToken, verifyAdmin, (req, res) => {
  res.status(200).json({
    message: 'View/manage all orders.',
  });
});

// Add New Post (admin only)
router.get('/add-new-post', verifyToken, verifyAdmin, (req, res) => {
  res.status(200).json({
    message: 'Add new posts for the platform.',
  });
});

module.exports = router;
