const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RecipeSchema = Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    instructions: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true })

RecipeSchema.index({
    '$**': 'text'
})

module.exports = mongoose.model('Recipe', RecipeSchema)