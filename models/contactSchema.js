const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
    socialLinks: {
        type: [String],
        required: true,
    },
    emails: {
        type: [String],
        required: true,
    },
    phoneNumbers: {
        type: [String],
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Contact", contactSchema);
