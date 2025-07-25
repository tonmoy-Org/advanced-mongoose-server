const Blog = require("../models/blogSchema");
const { getAsync, setexAsync, delAsync } = require("../config/redisClient");

// Helper function to clear relevant blog caches
const clearBlogCaches = async () => {
    try {
        const cacheKeys = ['blogs:*', 'blog:*'];
        for (const pattern of cacheKeys) {
            const keys = await redisClient.keys(pattern);
            if (keys.length) {
                await redisClient.del(keys);
            }
        }
    } catch (err) {
        console.error('Cache clearance error:', err);
    }
};

// Create a new blog
const createBlog = async (req, res) => {
    try {
        const { title, content, imageUrl, category, youtubeUrl } = req.body;

        // Basic validation
        if (!title || !content || !imageUrl || !category) {
            return res.status(400).json({
                error: "Title, content, image URL and category are required"
            });
        }

        const newBlog = new Blog({
            title,
            content,
            imageUrl,
            category,
            youtubeUrl: youtubeUrl || null,
        });

        await newBlog.save();

        // Clear relevant caches when new content is added
        await clearBlogCaches();

        res.status(201).json({
            message: "Blog created successfully",
            blog: newBlog
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: "A blog with this title already exists" });
        }
        res.status(500).json({
            error: "Failed to create blog",
            details: error.message,
        });
    }
};

// Get all blogs with filtering, sorting, and pagination
const getBlogs = async (req, res) => {
    try {
        const { category, search, sort = '-createdAt', page, limit } = req.query;

        // Create cache key based on all query parameters
        const cacheKey = `blogs:${category || 'all'}:${search || 'none'}:${sort}:${page || 'all'}:${limit || 'all'}`;

        // Try to get cached data
        const cachedData = await getAsync(cacheKey);
        if (cachedData) {
            return res.status(200).json(JSON.parse(cachedData));
        }

        // Build query
        const query = {};
        if (category) query.category = category;
        if (search) {
            query.$text = { $search: search }; // Uses text index
        }

        const mongoQuery = Blog.find(query).sort(sort).select('-__v');

        if (page && limit) {
            const pageNum = parseInt(page, 10);
            const limitNum = parseInt(limit, 10);
            mongoQuery.skip((pageNum - 1) * limitNum).limit(limitNum);
        }

        const blogs = await mongoQuery.lean();
        const total = await Blog.countDocuments(query);

        const response = {
            total,
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
            blogs
        };

        // Cache the response for 1 hour (3600 seconds)
        await setexAsync(cacheKey, 3600, JSON.stringify(response));

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            error: "Failed to fetch blogs",
            details: error.message,
        });
    }
};

// Get a single blog by title_id (slug)
const getBlogById = async (req, res) => {
    try {
        const cacheKey = `blog:${req.params.id}`;

        // Try to get cached data
        const cachedData = await getAsync(cacheKey);
        if (cachedData) {
            return res.status(200).json(JSON.parse(cachedData));
        }

        const blog = await Blog.findOne({ title_id: req.params.id });
        if (!blog) return res.status(404).json({ error: "Blog not found" });

        // Cache the blog for 1 hour (3600 seconds)
        await setexAsync(cacheKey, 3600, JSON.stringify(blog));

        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({
            error: "Failed to fetch blog",
            details: error.message,
        });
    }
};

// Update a blog by MongoDB _id
const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, imageUrl, category, youtubeUrl } = req.body;

        const updateData = {
            ...(title && { title }),
            ...(content && { content }),
            ...(imageUrl && { imageUrl }),
            ...(category && { category }),
            ...(youtubeUrl !== undefined && { youtubeUrl }),
        };

        const updatedBlog = await Blog.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!updatedBlog) {
            return res.status(404).json({ error: "Blog not found" });
        }

        // Clear relevant caches when content is updated
        await clearBlogCaches();

        res.status(200).json({
            message: "Blog updated successfully",
            blog: updatedBlog,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: "A blog with this title already exists" });
        }
        res.status(500).json({
            error: "Failed to update blog",
            details: error.message,
        });
    }
};

// Delete a blog by MongoDB _id
const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBlog = await Blog.findByIdAndDelete(id);

        if (!deletedBlog) {
            return res.status(404).json({ error: "Blog not found" });
        }

        // Clear relevant caches when content is deleted
        await clearBlogCaches();

        res.status(200).json({
            message: "Blog deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            error: "Failed to delete blog",
            details: error.message,
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