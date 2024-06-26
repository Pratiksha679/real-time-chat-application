const MessageModel = require('../Models/MessageModel');

const createMessage = async (req, res) => {
    const { chatId, senderId, message } = req.body;
    const newMessage = new MessageModel({
        chatId,
        senderId,
        message
    });
    try {
        const response = await newMessage.save();
        res.status(200).json(response);
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const getMessages = async (req, res) => {
    const chatId = req.params.chatId;

    try {
        const response = await MessageModel.find({
            chatId
        })
        res.status(200).json(response);
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

module.exports = { createMessage, getMessages }