const Blog = require("../models/blogSchema");

// ➤ Create a new blog
const createBlog = async (req, res) => {
    try {
        const {
            title,
            content,
            imageUrl,
            category,
            isFeatured,
            tags,
            youtubeUrl,
            metaTitle,
            metaDescription
        } = req.body;

        // Basic validation
        if (!title || !content || !imageUrl || !category) {
            return res.status(400).json({
                error: "Title, content, image URL and category are required"
            });
        }

        // Create slug from title
        const titleSlug = title.toLowerCase()
            .replace(/[^\w\s]/gi, '')
            .replace(/\s+/g, '_');

        const newBlog = new Blog({
            title,
            title_id: titleSlug,
            content,
            imageUrl,
            category,
            isFeatured: isFeatured || false,
            tags: tags ? tags.filter(tag => tag.trim() !== '') : [],
            youtubeUrl: youtubeUrl || null,
            metaTitle: metaTitle || title,
            metaDescription: metaDescription || `${title.substring(0, 160)}...`
        });

        await newBlog.save();

        res.status(201).json({
            message: "Blog created successfully",
            blog: newBlog
        });
    } catch (error) {
        if (error.code === 11000) { // Duplicate key error (title_id)
            return res.status(400).json({
                error: "A blog with similar title already exists"
            });
        }
        res.status(500).json({
            error: "Failed to create blog",
            details: error.message
        });
    }
};

// ➤ Get all blogs with optional filtering and sorting
const getBlogs = async (req, res) => {
    try {
        const {
            category,
            featured,
            search,
            sort = '-createdAt'
        } = req.query;

        // Build query
        const query = {};
        if (category) query.category = category;
        if (featured) query.isFeatured = true;
        if (search) {
            query.$text = { $search: search };
        }

        const blogs = await Blog.find(query)
            .sort(sort)
            .select('-__v'); // Exclude version key

        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({
            error: "Failed to fetch blogs",
            details: error.message
        });
    }
};


// ➤ Get a single blog by ID or metaTitle
const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findOne({ title_id: req.params.id });
        if (!blog) return res.status(404).json({ error: "Blog not found" });

        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch blog", details: error.message });
    }
};



// ➤ Update a blog
const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // If title is being updated, generate new slug
        if (updateData.title) {
            updateData.title_id = updateData.title
                .toLowerCase()
                .replace(/[^\w\s]/gi, '')
                .replace(/\s+/g, '_');
        }

        // Clean tags array if provided
        if (updateData.tags) {
            updateData.tags = updateData.tags.filter(tag => tag.trim() !== '');
        }

        const updatedBlog = await Blog.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedBlog) {
            return res.status(404).json({ error: "Blog not found" });
        }

        res.status(200).json({
            message: "Blog updated successfully",
            blog: updatedBlog
        });
    } catch (error) {
        if (error.code === 11000) { // Duplicate key error
            return res.status(400).json({
                error: "A blog with this title already exists"
            });
        }
        res.status(500).json({
            error: "Failed to update blog",
            details: error.message
        });
    }
};

// ➤ Delete a blog
const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBlog = await Blog.findByIdAndDelete(id);

        if (!deletedBlog) {
            return res.status(404).json({ error: "Blog not found" });
        }

        res.status(200).json({
            message: "Blog deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            error: "Failed to delete blog",
            details: error.message
        });
    }
};



module.exports = {
    createBlog,
    getBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
};