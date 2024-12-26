const { log } = require("console");
const {Router} = require("express");
const multer = require("multer");
const path = require("path");
const Blog = require('../models/blog');
const Comment = require('../models/comment');

const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/uploads`));
    },
    filename: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    }
});
  
const upload = multer({ storage: storage })

router.get("/add-new", (req, res) =>{
    return res.render("addBlog", {
        user: req.user,
    });
});

//when we click on view on a blog
router.get('/:id', async(req, res) => {
    //populate method ki wajah se user ki poori info bhi print ho jayegi
    const blog = await Blog.findById(req.params.id).populate('createdBy');
    
    //ab saare comments render karwa do
    const comments = await Comment.find({ blogId: req.params.id }).populate('createdBy');
    console.log(blog);
    console.log(comments);
    return res.render("blog", {
        user: req.user,
        blog,
        comments,
    });
});

//is route pe blogId ke saath request karengey
//aur comment add ho jayega
router.post('/comment/:blogId', async(req, res) => {
    await Comment.create({
        content: req.body.content,
        blogId: req.params.blogId,
        createdBy: req.user._id,
    });
    return res.redirect(`/blog/${req.params.blogId}`);
});

router.post("/", upload.single("coverImage"), async(req, res) => {
    console.log(req.body);
    console.log(req.file);
    const {title, body} = req.body;
    const blog = await Blog.create({
        body,
        title,
        createdBy: req.user._id,
        coverImageURL: `/uploads/${req.file.filename}`
    });
    console.log(blog._id);
    
    res.redirect(`/blog/${blog._id}`);
});

module.exports = router;