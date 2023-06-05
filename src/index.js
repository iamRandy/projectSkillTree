const express = require('express');
const app = express();
const path = require("path");
const hbs = require("hbs");
const collection = require('./mongodb');

const templatePath = path.join(__dirname, "../templates")
const PORT = 3000;

app.use(express.json());
app.set("view engine", "hbs");
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

    await collection.insertMany([data]);

    // Directs to homepage after submitting form
    res.render("home")

}) 

app.post('/login', async (req, res) => {
// There's an error to this code
    try {
        const checkData = await collection.findOne({username:req.body.username})

        if (checkData.password == req.body.password) {
            res.render(checkData)
        }
        else {
            res.send("Wrong password")
        }
    }
    catch{
        res.send("Wrong username and password")
    }
})

// Check to see if server is working
app.listen(PORT, () => {
    console.log('port connected', PORT)
})