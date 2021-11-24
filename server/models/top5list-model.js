const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const Top5ListSchema = new Schema(
    {
        name: { type: String, required: true },
        items: { type: [String], required: true },
        ownerEmail: { type: String },
        ownerUsername: { type: String },
        likes: { type: Number, required: true },
        dislikes: { type: Number, required: true },
        views: { type: Number, required: true },
        comments: [{type: ObjectId, ref: 'Comment'}],
        publishDate: { type: Date, required: true },
        lastEditDate: { type: Date, required: true },

    },
    { timestamps: true },
)

module.exports = mongoose.model('Top5List', Top5ListSchema)
