const mongoose = require('mongoose');
const colors = require('colors');

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URL}`)
        console.log('Connected to MongoDB'.bgCyan.white);
    } catch (error) {
        console.log(`"MONGODB connection error: " ${error}`.bgRed.white);
        process.exit(1);
    }
}

module.exports = connectDB;