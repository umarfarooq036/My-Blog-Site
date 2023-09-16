const { auth } = require('express-openid-connect');
const { requiresAuth } = require('express-openid-connect');
const express = require("express");
const { join } = require("path");
const config = require('./config/auth0config.js');;
const app = express();
const port = 3000;
const localIp = "192.168.10.11";


const ConnectDatabase = require("./config/database");
const Blog = require("./models/Blog.js")
const { v4: uuidv4 } = require('uuid');
const methodOverride = require("method-override");
const { Console, log } = require('console');
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"));
app.set("view engine", "ejs")
// app.set("views",path.join(__dirname,"views"))



// require("dotenv").config();
// authKey = process.env.AUTH0_SECRET_KEY;


// const config = {
//     authRequired: false,
//     auth0Logout: true,
//     secret: authKey,
//     baseURL: 'http://localhost:3000',
//     clientID: 'M7lAiNvASbF9tcnl10nYZG6dH2kRXHfN',
//     issuerBaseURL: 'https://dev-ueu8pgmosxm48d8z.us.auth0.com',
// };


ConnectDatabase();

app.use(auth(config));

// app.get('/profile', requiresAuth(), (req, res) => {
//     res.send(JSON.stringify(req.oidc.user));
//     // console.log(JSON.stringify(req.oidc.user));
//     const  json = req.oidc.user;
//     console.log(json.name);
// });

// app.get("/login", async (req, res) => {
//     if (req.oidc.isAuthenticated) {
//         // let {name} = req.oidc.user;
//         let name = "user";
//         const blogs = await Blog.find({});
//         res.render("Blogs/blogs.ejs", { blogs, name });
//         console.log(name)
//     }
//     else {
//         res.redirect('/login');
//     }
// });
app.get("/", async (req, res) => {
    let name = "";
    let blogs = undefined;
    if ((req.oidc.isAuthenticated())) {
        userID = req.oidc.user.sub;
        // const blogs = await Blog.find({ userID }).sort({ createdAt: -1 }).exec();
        const blogs = await Blog.find({ userID }).sort({ createdAt: -1 }).limit(2);
        userData = req.oidc.user;
        if (userData) {
            // return res.render("home.ejs", { name: userData.name });
            try {
                res.render('home', { name: userData.name, blogs });
            } catch (error) {
                console.error('Error fetching blogs:', error);
                res.status(500).json({ error: 'Error fetching blogs' });
            }
        }
    }
    else {
        return res.render("home.ejs", { name, blogs });
    }
});

app.get("/Blogs", async (req, res) => {
    let name = "";
    userData = req.oidc.user
    if ((req.oidc.isAuthenticated())) {
        userID = req.oidc.user.sub;
        let blogs = await Blog.find({ userID });
        if (userData) {
            return res.render("Blogs/blogs.ejs", { blogs, name: userData.name });
        }
    }
    else {
        res.redirect("/login");
    }

});

app.get("/new-blog", (req, res) => {
    // res.render("Blogs/new.ejs")
    let name = "";
    if (req.oidc.isAuthenticated()) {
        userData = req.oidc.user;
        if (userData) {
            res.render("Blogs/new.ejs", { name: userData.name });
        }
        // else {
        //     res.render("home.ejs",{name});
        // }

    }
    else {
        res.redirect("/login");
    }
});

//create blog API
app.post("/blogs", async (req, res) => {
    // console.log(req.body);
    const { title, description, image } = req.body;
    // const newBlog = { title, description, image, id: uuidv4() }
    // blogs.push(newBlog)
    const blog = new Blog({
        title, description, image, userID: req.oidc.user.sub
    });
    // const blog = Object.create({
    //     title, description,image
    // })
    // console.log(blog)
    try {
        await blog.save();
        res.redirect("/blogs");
    } catch (error) {
        console.log('Error', error);
    }

})
app.get("/blogs/:id", async (req, res) => {
    if (req.oidc.isAuthenticated()) {
        const { id } = req.params
        const foundBlog = await Blog.findById(id);
        userData = req.oidc.user
        if (userData) {
            return res.render("Blogs/show.ejs", { foundBlog, name: userData.name })
        }
    }
});

app.get("/blogs/:id/edit", async (req, res) => {
    // const { id } = req.params
    // const foundBlog = await Blog.findById(id)
    // res.render("Blogs/edit.ejs", { foundBlog })
    if (req.oidc.isAuthenticated()) {
        const { id } = req.params
        const foundBlog = await Blog.findById(id);
        userData = req.oidc.user
        if (userData) {
            return res.render("Blogs/edit.ejs", { foundBlog, name: userData.name })
            // return res.render("Blogs/show.ejs", { foundBlog, name: userData.name })
        }
    }

})

app.patch("/blogs/:id", async (req, res) => {
    const { id } = req.params
    const { title, description, image } = req.body
    const foundBlog = await Blog.findByIdAndUpdate(id, { title, description, image })

    // if (foundBlog.title != title) {
    //     foundBlog.title = title
    // }
    // if (foundBlog.description != description) {
    //     foundBlog.description = description
    // }
    // if (foundBlog.image != image) {
    //     foundBlog.image = image
    // }
    res.redirect("/blogs")

})

app.delete("/blogs/:id", async (req, res) => {
    const { id } = req.params
    const foundBlog = await Blog.findByIdAndDelete(id)
    // for (blog of blogs) {
    //     if (blog.id === id) {
    //         blogs.splice(blogs.indexOf(blog), 1)
    //     }
    // }
    // // blogs.splice(blogs.indexOf(id),1)
    res.redirect("/blogs")
})

app.get("/search", async (req, res) => {
    const query = req.query.q.toLowerCase();
    userData = req.oidc.user;
    userID = req.oidc.user.sub;
    const regex = new RegExp(query, 'i');
    const results = await Blog.find({
        $or: [
            { title: regex },
            { description: regex },
        ],userID
    }).exec();
    res.render("Blogs/searched.ejs",{results, name: req.oidc.user.name});

});

app.get("*", (req, res) => {
    res.send("<h1>404 Page not found</h1>")
})

app.listen(port,() => {
    console.log(`Server is listening at port ${port}.`);
})
