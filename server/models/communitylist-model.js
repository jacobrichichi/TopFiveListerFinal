const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const CommunityListSchema = new Schema(
    {
        name: { type: String, required: true },
        items: { type: [String], required: true },
        votes: { type: [Number], required: true},
        likes: { type: Number, required: true},
        dislikes: { type: Number, required: true },
        views: { type: Number, required: true },
        comments: [{type: ObjectId, ref: 'Comment'}],
        lastEditDate: { type: Date, required: true }
    },
    { timestamps: true },
)

module.exports = mongoose.model('CommunityList', CommunityListSchema)