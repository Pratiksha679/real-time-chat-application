const UserModel = require('../Models/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const createToken = (_id) => {
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    return jwt.sign({ _id }, jwtSecretKey, { expiresIn: "3d" });
}

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        let user = await UserModel.findOne({
            email: email
        });

        if (user) return res.status(400).json("User with the given email already exists...");

        if (!name || !email || !password) return res.status(400).json("All the fields are required...");

        if (!validator.isEmail(email)) return res.status(400).json("Please enter a valid email address...");

        if (!validator.isStrongPassword(password)) return res.status(400).json("The password must be strong password...");

        const salt = await bcrypt.genSalt(10);

        user = new UserModel({ name, email, password });
        user.password = await bcrypt.hash(user.password, salt);

        await user.save();
        const token = createToken(user._id);
        res.status(200).json({
            id: user._id,
            name,
            email,
            token
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({
            email
        });

        if (!user) {
            return res.status(400).json("Invalid email / password");
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(400).json("Invalid email / password");
        }

        const token = createToken(user._id);
        res.status(200).json({
            id: user._id,
            name: user.name,
            email,
            token
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const findUser = async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await UserModel.findById(userId);
        res.status(200).json(user);
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const findUsers = async (req, res) => {
    try {
        const users = await UserModel.find();
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json(error);
    }
}

module.exports = { registerUser, loginUser, findUser, findUsers };