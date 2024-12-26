const { Schema, model } = require('mongoose');

//comment mein content hoga aur comment karne wale ki details aur
//konse blog pe hua hai comment, us blog ki details
const commentSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    blogId: {
        type: Schema.Types.ObjectId,
        ref: "blog", 
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "user",
    }
}, {timestamps: true});

const Comment = model('comment', commentSchema);

module.exports = Comment;