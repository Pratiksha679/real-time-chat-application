const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoute = require('./Routes/UserRoute')
const chatRoute = require('./Routes/ChatRoute');
const messageRoute = require('./Routes/MessageRoute');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/users', userRoute);
app.use('/api/chats', chatRoute);
app.use('/api/messages', messageRoute);

app.get("/", (req, res) => {
    res.send("Welcome to our chat application API");
});

const port = process.env.port || 5000;
const uri = process.env.MONGODB_URL;

mongoose.connect(
    uri).
    then(() => {
        console.log('MongoDB connection established')
    }).
    catch((error) => {
        console.log("MongoDB connection failed")
    });

app.listen(port, (req, res) => {
    console.log(`Server running on port : ${port}`)
})
