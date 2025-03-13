const Blog = require("../models/blogSchema");

// ➤ Create a new blog
const createBlog = async (req, res) => {
    try {
        const { title, content, imageUrl } = req.body;

        if (!title || !content || !imageUrl) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const newBlog = new Blog({ title, content, imageUrl });
        await newBlog.save();

        res.status(201).json({ message: "Blog created successfully", blog: newBlog });
    } catch (error) {
        res.status(500).json({ error: "Failed to create blog", details: error.message });
    }
};


// ➤ Get all blogs
const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch blogs", details: error.message });
    }
};

// ➤ Get a single blog by ID
const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ error: "Blog not found" });

        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch blog", details: error.message });
    }
};

// ➤ Update a blog
const updateBlog = async (req, res) => {
    try {
        const { title, content, imageUrl } = req.body;
        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            { title, content, imageUrl },
            { new: true, runValidators: true }
        );

        if (!updatedBlog) return res.status(404).json({ error: "Blog not found" });

        res.status(200).json({ message: "Blog updated successfully", blog: updatedBlog });
    } catch (error) {
        res.status(500).json({ error: "Failed to update blog", details: error.message });
    }
};

// ➤ Delete a blog
const deleteBlog = async (req, res) => {
    try {
        const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
        if (!deletedBlog) return res.status(404).json({ error: "Blog not found" });

        res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete blog", details: error.message });
    }
};


module.exports = { createBlog, getBlogs, getBlogById, updateBlog, deleteBlog };