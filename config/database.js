require("dotenv").config()

const mongoose = require("mongoose")

const ConnectDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URI)

        console.log("Connected to the database!");

    } catch (e) {
        console.log("Oh No an error occured!");
        console.log(e)
    }
    
}

module.exports = ConnectDatabase;