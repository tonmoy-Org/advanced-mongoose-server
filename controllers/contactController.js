const Contact = require("../models/contactSchema");

// Create a new contact
exports.createContact = async (req, res) => {
  try {
    const { socialLinks, emails, phoneNumbers, address } = req.body;
    console.log(req.body);
    // Validate required fields
    if (!emails?.length || !phoneNumbers?.length || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newContact = new Contact({ socialLinks, emails, phoneNumbers, address });

    await newContact.save();
    res.status(201).json({ message: "Contact created successfully", newContact });
  } catch (error) {
    res.status(500).json({ message: "Error creating contact", error: error.message });
  }
};

// Get all contacts
exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching contacts", error: error.message });
  }
};

// Get a single contact by ID
exports.getContactById = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ message: "Error fetching contact", error: error.message });
  }
};

// Update a contact
exports.updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, socialLinks, emails, phoneNumbers, address } = req.body;

    // Validate at least one field is being updated
    if (!name && !socialLinks && !emails && !phoneNumbers && !address) {
      return res.status(400).json({ message: "At least one field must be updated" });
    }

    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      { name, socialLinks, emails, phoneNumbers, address },
      { new: true, runValidators: true } // Ensures schema rules are enforced
    );

    if (!updatedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json({ message: "Contact updated successfully", updatedContact });
  } catch (error) {
    res.status(500).json({ message: "Error updating contact", error: error.message });
  }
};

// Delete a contact
exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedContact = await Contact.findByIdAndDelete(id);

    if (!deletedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting contact", error: error.message });
  }
};
