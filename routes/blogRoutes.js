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
router.post("/", createBlog);
router.get("/", getBlogs);
router.get("/:id", getBlogById);
router.put("/:id", updateBlog);
router.delete("/:id", deleteBlog);



module.exports = router;
