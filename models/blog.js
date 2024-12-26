const { Schema, model } = require('mongoose');

const blogSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    coverImageURL: {
        type: String,
        required: false,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        //user collections mein se id le aayega current user ki
        ref: "user",
    },
}, {timestamps: true});

const Blog = model("blog", blogSchema);

module.exports = Blog;