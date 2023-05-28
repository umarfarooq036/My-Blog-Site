const express = require("express");
const app = express();
const port = 3000;

const { v4: uuidv4 } = require('uuid');
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"));
app.set("view engine", "ejs")
// app.set("views",path.join(__dirname,"views"))

// Fake Database
let blogs = [
    {
        id: uuidv4(),
        title: "Organic Food for health",
        description:
            "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
        image:
            "https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
        id: uuidv4(),
        title: "Better to Eat",
        description:
            "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
        image:
            "https://images.pexels.com/photos/3669640/pexels-photo-3669640.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
        id: uuidv4(),
        title: "Exercise is Best Cure",
        description:
            "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
        image:
            "https://images.pexels.com/photos/2294361/pexels-photo-2294361.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
        id: uuidv4(),
        title: "Laxury Cars",
        description:
            "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
        image:
            "https://images.pexels.com/photos/6894427/pexels-photo-6894427.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
];


app.get("/", (req, res) => {
    // res.send("HEllo")
    res.render("home.ejs");
});
app.get("/Blogs", (req, res) => {
    // res.send("Hello I reached the Blogs Page")
    res.render("Blogs/blogs.ejs", { blogs });

});

app.get("/new-blog", (req, res) => {
    res.render("Blogs/new.ejs")
});
app.post("/blogs", (req, res) => {
    // console.log(req.body);
    const { title, description, image } = req.body;
    const newBlog = { title, description, image, id: uuidv4() }
    blogs.push(newBlog)
    res.redirect("blogs")
})
app.get("/blogs/:id", (req, res) => {
    // console.log(req.params);
    const { id } = req.params
    // console.log(id);
    const foundBlog = blogs.find((blog) => blog.id === id);
    // console.log(foundBlog);
    // console.log("I find the blog");
    res.render("Blogs/show.ejs", { foundBlog })
});

app.get("/blogs/:id/edit", (req, res) => {
    const { id } = req.params
    const foundBlog = blogs.find((blog) => blog.id === id)
    res.render("Blogs/edit.ejs", { foundBlog })

})  

app.patch("/blogs/:id",(req,res)=>{
    const {id}=req.params
    const {title,description,image}=req.body
    const foundBlog = blogs.find((blog) => blog.id === id)
    
    if(foundBlog.title != title){
        foundBlog.title=title
    }
    if(foundBlog.description != description){
        foundBlog.description=description
    }
    if(foundBlog.image != image){
        foundBlog.image = image
    }
    res.redirect("/blogs")

})

app.delete("/blogs/:id",(req,res)=>{
    const {id}=req.params
    const foundBlog = blogs.find((blog) => blog.id === id)
    for(blog of blogs){
        if(blog.id === id)
        {
            blogs.splice(blogs.indexOf(blog),1)
        }
    }
            // blogs.splice(blogs.indexOf(id),1)


    res.redirect("/blogs")
})

app.get("*", (req, res) => {
    res.send("<h1>404 Page not found</h1>")
})

app.listen(port, () => {
    console.log("Server is listening at 3000.");
})
