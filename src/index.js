const express = require('express');
const app = express();
const path = require("path");
// const hbs = require("hbs");
const ejs = require('ejs')
const userCollection = require('./mongodb');

const templatePath = path.join(__dirname, "../templates")
const PORT = 3000;

app.use(express.json());
app.set("view engine", "ejs");
app.set("views", templatePath);
app.use(express.urlencoded())

// render signup page as the original screen
app.get("/", (req, res) => {
    res.render("signup");
})

app.get("/login", (req, res) => {
    res.render("login");
})

// Get information from the form @ Signup page
app.post("/signup", async (req, res) => {

    const data = {
        username: req.body.username,
        password: req.body.password
    }

    await userCollection.insertMany([data]);

    // Directs to homepage after submitting form
    res.render("home")

}) 

app.post('/login', async (req, res) => {

    try {
        const checkUsername = await userCollection.findOne({username: req.body.username});
        if (checkUsername.password == req.body.password)
        {
            const username = req.body.username;
            console.log(username);
            res.render("home", {username: "Dhruv"})
        }
        else
        {
            res.send("Wrong Password")
        }
    }
    catch {
        res.send("Wrong username or password")
    }
    // try {
    //     if (checkData.password == req.body.password) { 
    //         res.render("home", checkData.username)
    //     }
    //     else {
    //         res.send("Wrong password")
    //     }
    // }
    // catch{ //if username is not in the database
    //     res.send(`Wrong username and password:${checkData.username}:${checkData.password}`);
    // }
})

// Check to see if server is working
app.listen(PORT, () => {
    console.log('port connected', PORT)
})