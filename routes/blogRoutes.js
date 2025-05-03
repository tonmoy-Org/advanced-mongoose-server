const express = require('express');

const {
    createBlog,
    deleteBlog,
    getBlogById,
    getBlogs,
    updateBlog,
} = require('../controllers/blogControllers');

const router = express.Router();



// Blog Routes
router.post("/", createBlog); // Create a blog
router.get("/", getBlogs); // Get all blogs
router.get("/:id", getBlogById); // Get blog by ID
router.put("/:id", updateBlog); // Update blog
router.delete("/:id", deleteBlog); // Delete blog



module.exports = router;
