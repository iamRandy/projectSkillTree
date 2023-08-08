require('dotenv').config();
const express = require('express');
const app = express();
const path = require("path");
const ejs = require('ejs');
const userCollection = require('./mongodb');
const mongoose = require('mongoose');
const {toHex, utf8ToBytes} = require("ethereum-cryptography/utils")
const {sha256} = require('ethereum-cryptography/sha256')
const {getRandomBytesSync} = require("ethereum-cryptography/random")

const templatePath = path.join(__dirname, "../templates")
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.set("view engine", "ejs");
app.set("views", templatePath);
app.use(express.urlencoded())

mongoose.set('strictQuery', false)
const connectDB = async ()=> {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

// render signup page as the original screen
app.get("/", (req, res) => {
    res.render("signup");
})

app.get("/login", (req, res) => {
    res.render("login");
})

// Get information from the form @ Signup page
app.post("/signup", async (req, res) => {

    // Store pass in DB

    const data = {
        // hash password, make sure username is valid (not just one letter), make sure it's not in use)
        username: req.body.username,
        password: hashPass(req.body.password)
    }

    await userCollection.insertMany([data]);

    // Directs to homepage after submitting form
    res.render("home", data)

}) 

function hashPass(userPassword) {
    let byteSalt = getRandomBytesSync(12);
    let hexSalt = toHex(byteSalt);
    let lengthHexSalt = hexSalt.length;
    let hexSaltPass = hexSalt + userPassword
    let utf8Pass = utf8ToBytes(hexSaltPass);
    let shaPass = sha256(utf8Pass)
    let hexPass = "$" + lengthHexSalt + hexSalt + toHex(shaPass)

    return hexPass;
}

app.post('/login', async (req, res) => {

    try {
        const checkUsername = await userCollection.findOne({username: req.body.username});
        if (checkUsername.password == checkPassword(req.body.password, checkUsername.password))
        {
            const username = req.body.username;
            res.render("home", {username: username})
        }
        else
        {   
            res.send("Wrong Password")
        }
    }
    catch {
        res.send("Wrong username or password")
    }
})

function checkPassword(bodyPassword, DBpassword) {
        // Compare Salt
    let lengthHexSalt = Number(DBpassword.slice(1, 3))
    let hexCompareSalt = DBpassword.slice(3, lengthHexSalt+3)
    let lengthCompareHexSalt = hexCompareSalt.length;
    let hexCompareSaltPass = hexCompareSalt + bodyPassword
    let utfCompare8Pass = utf8ToBytes(hexCompareSaltPass);
    let shaComparePass = sha256(utfCompare8Pass)
    let hexComparePass = "$" + lengthCompareHexSalt + hexCompareSalt + toHex(shaComparePass)
    return hexComparePass

    // $24cee5195f158c49bfd43df34e d0cadc5df431a89f22de691b7245bcad22e3a112c70030fb6c14429a61ee1b08
    // $24cee5195f158c49bfd43df34e bb1a9b9aaea1f199b557032fed097dc95df1a82c1d97d47ca2dc4b7aa7aa6408

}

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`)
    })
});
