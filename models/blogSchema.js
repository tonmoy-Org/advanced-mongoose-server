const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
    {
        title: { 
            type: String, 
            required: true, 
            trim: true 
        },
        title_id: {  
            type: String, 
            required: true,
            unique: true,
            trim: true
        },
        content: { 
            type: String, 
            required: true 
        },
        imageUrl: { 
            type: String, 
            required: true 
        },
        category: {
            type: String,
            enum: ['technology', 'business', 'education', 'marketing'],
            required: true
        },
        isFeatured: {
            type: Boolean,
            default: false
        },
        tags: [{
            type: String,
            trim: true
        }],
        metaTitle: {
            type: String,
            trim: true
        },
        metaDescription: {
            type: String,
            trim: true
        },
        createdAt: { 
            type: Date, 
            default: Date.now 
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    },
    { 
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Add text index for search functionality
blogSchema.index({
    title: 'text',
    content: 'text',
    tags: 'text'
});

// Pre-save hook to generate title_id (slug) from title
blogSchema.pre('save', function(next) {
    if (this.isModified('title')) {
        this.title_id = this.title
            .toLowerCase()
            .replace(/[^\w\s]/gi, '')
            .replace(/\s+/g, '_');
    }
    next();
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;