const mongoose = require("mongoose")

const blogSchema = mongoose.Schema({
    title: {
        type: String,
      },
      description: {
        type: String,
      },
      image: {
        type: String,
      },
      category: {
        type: String,
      },
      userID:{
        type:String, required: true
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
})

const Blog = mongoose.model('Blog', blogSchema)
module.exports = Blog;

