require("dotenv").config();
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');

const Blog = require('./models/blog');

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");

const app = express();
//Cloud providers environment variable dete hain
//unme se ek ariable PORT naam ka hoga jispe hum listen karwayenge
console.log(process.env.PORT);
const PORT = process.env.PORT || 8000;

//thik port ki tarah hume ye variable ki tarah set karna padega
console.log(process.env.MONGO_URL);
//mongodb://127.0.0.1:27017/blogify
mongoose.connect(process.env.MONGO_URL).then((e)=> console.log("MongoDB Connected"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
//express hamares static assets ko aise hi serve nahi karta 
//wo /uploads/filename ko ek route ki tarah treate karega aur bolega ye route to exist hi nahi karta
//to ye middleware bata dega ki public folder ke assets ko statically serve kardo
app.use(express.static(path.resolve('./public')));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.get("/", async(req, res) =>{
    //-1 means descending sort
    const allBlogs = await Blog.find({});
    res.render("home", {
        user: req.user,
        blogs: allBlogs,
    });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(PORT, ()=> console.log(`Server Started at PORT: ${PORT}`));