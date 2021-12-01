const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const Top5ListSchema = new Schema(
    {
        name: { type: String, required: true },
        items: { type: [String], required: true },
        ownerEmail: { type: String, required: true },
        ownerUsername: { type: String, required: true },
        likes: { type: Number, required: true },
        dislikes: { type: Number, required: true },
        views: { type: Number, required: true },
        comments: [{type: ObjectId, ref: 'Comment'}],
        publishDate: { type: Date, required: true },
        isPublished: { type: Boolean, required: true },
        lastEditDate: { type: Date, required: true },

    },
    { timestamps: true },
)

module.exports = mongoose.model('Top5List', Top5ListSchema)
