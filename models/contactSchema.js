const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
    emails: {
        type: [String],
        validate: {
            validator: (arr) => arr.length > 0, // Ensure at least one email
            message: "At least one email is required",
        },
        required: true,
    },
    phoneNumbers: {
        type: [String],
        validate: {
            validator: (arr) => arr.length > 0, // Ensure at least one phone number
            message: "At least one phone number is required",
        },
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    socialLinks: [
        {
            title: {
                type: String,
                required: true,
            },
            link: {
                type: String,
                required: true,
            },
        },
    ],
});

module.exports = mongoose.model("Contact", contactSchema);
