const ChatModel = require('../Models/ChatModel');

const createChat = async (req, res) => {
    const { firstId, secondId } = req.body;

    try {
        const chat = await ChatModel.findOne({
            members: { $all: [firstId, secondId] }
        });
        if (chat) {
            return res.status(200).json(chat);
        }
        const newChat = new ChatModel({
            members: [firstId, secondId]
        });

        const response = await newChat.save();
        res.status(200).json(response);
    }
    catch (error) {
        res.status(500).send(error);
    }
}

const findUserChats = async (req, res) => {
    const userId = req.params.userId;
    try {
        const chats = await ChatModel.find({
            members: { $in: [userId] }
        })
        res.status(200).json(chats);
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const findChat = async (req, res) => {
    const firstId = req.params.firstId;
    const secondId = req.params.secondId;
    try {
        const chat = await ChatModel.findOne({
            members: { $all: [firstId, secondId] }
        })
        res.status(200).json(chat);
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

module.exports = { createChat, findUserChats, findChat }