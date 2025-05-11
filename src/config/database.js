const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect('mongodb+srv://anubhavpratapsingh93:ZcsaeKAonSRcwzh2@cluster0.ccqyyyf.mongodb.net/devTinder');
};

module.exports = connectDB;