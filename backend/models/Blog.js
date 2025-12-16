import mongoose from "mongoose";
const blogsSchema = new mongoose.Schema(
  { 
    username:{
        type: String,
        required : true,
    },
    thumbnailurl:{
        type:String,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: Object, 
      required: true,
    },
  },
  { timestamps: true }
);
const BlogModel = mongoose.model("Blog", blogsSchema);
export default BlogModel;
