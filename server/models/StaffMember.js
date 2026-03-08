const mongoose = require('mongoose');

const StaffMemberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
    level: {
        type: String,
        required: true,
        enum: ['Britsync', 'Continental_Coordinator', 'Regional_Coordinator', 'Ground_Team']
    },
    location: { type: String }, // e.g., "Europe", "Nigeria", "Lagos"
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StaffMember',
        default: null
    },
    photo: { type: String },
    department: { type: String, default: 'Core' },
    linkedin: { type: String },
    industries: [{
        title: { type: String },
        info: { type: String },
        image: { type: String }
    }],
    order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('StaffMember', StaffMemberSchema);
