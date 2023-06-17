const mongoose = require('mongoose');
const url = "mongodb://localhost:27017/SkillGrove";

mongoose.connect(url)
.then(() => {
    console.log("mongo connected");
})
.catch((err) => {
    console.log("Mongo failed to connect ", err);
})

const LoginSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

// make a schema signup (but unsure if making one will create a new )

const userCollection = new mongoose.model("users", LoginSchema);

module.exports = userCollection;