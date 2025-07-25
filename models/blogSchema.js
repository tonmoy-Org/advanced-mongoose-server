const mongoose = require('mongoose');
const slugify = require('slugify');

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        title_id: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            index: true,
        },
        content: {
            type: String,
            required: true,
        },
        imageUrl: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
            trim: true,
        },
        youtubeUrl: {
            type: String,
            trim: true,
            default: null,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Compound text index including title_id for search
blogSchema.index({
    title: 'text',
    content: 'text',
    tags: 'text',
    title_id: 'text',
});

// Pre-validate hook for unique, SEO-friendly slug generation
blogSchema.pre('validate', async function (next) {
    if (this.isModified('title') || !this.title_id) {
        const baseSlug = slugify(this.title, { lower: true, strict: true });
        let slug = baseSlug;
        let count = 1;

        const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);

        while (await Blog.findOne({ title_id: slug, _id: { $ne: this._id } })) {
            slug = `${baseSlug}-${count}`;
            count++;
        }

        this.title_id = slug;
    }
    next();
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;