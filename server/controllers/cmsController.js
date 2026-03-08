const GatewayNode = require('../models/GatewayNode');
const AcademyResource = require('../models/AcademyResource');
const AwardTier = require('../models/AwardTier');
const FAQ = require('../models/FAQ');
const ContactNode = require('../models/ContactNode');
const DynamicContent = require('../models/DynamicContent');
const ExpertNode = require('../models/ExpertNode');

const models = {
    gateway: GatewayNode,
    academy: AcademyResource,
    awards: AwardTier,
    faqs: FAQ,
    contact: ContactNode,
    content: DynamicContent,
    experts: ExpertNode
};

// Generic CRUD Operations
exports.getAll = async (req, res) => {
    try {
        const { type } = req.params;
        if (!models[type]) return res.status(400).json({ message: 'Invalid entity type' });
        const data = await models[type].find().sort({ order: 1 });
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.create = async (req, res) => {
    try {
        const { type } = req.params;
        if (!models[type]) return res.status(400).json({ message: 'Invalid entity type' });
        const newItem = new models[type](req.body);
        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const { type, id } = req.params;
        if (!models[type]) return res.status(400).json({ message: 'Invalid entity type' });
        const updatedItem = await models[type].findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedItem) return res.status(404).json({ message: 'Item not found' });
        res.json(updatedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const { type, id } = req.params;
        if (!models[type]) return res.status(400).json({ message: 'Invalid entity type' });
        const deletedItem = await models[type].findByIdAndDelete(id);
        if (!deletedItem) return res.status(404).json({ message: 'Item not found' });
        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Bulk Upsert for Dynamic Content (Sections/Hero strings)
exports.bulkUpsertContent = async (req, res) => {
    try {
        const { sectionId, items } = req.body; // items: [{ key, value }]
        const ops = items.map(item => ({
            updateOne: {
                filter: { sectionId, key: item.key },
                update: { value: item.value },
                upsert: true
            }
        }));
        await DynamicContent.bulkWrite(ops);
        res.json({ message: 'Content synchronized successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        res.json({ filePath: `uploads/${req.file.filename}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
