const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommunityItemSchema = new Schema(
    {
        item: { type: String, required: true },
        votes: {type: Number, required: true}

    },
    { timestamps: true },
)

module.exports = mongoose.model('CommunityItem', CommunityItemSchema)