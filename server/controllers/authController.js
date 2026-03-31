const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const getAllUser = async(req, res) => {
    const users = await User.find()
    if(users){
        return res.status(200).json(users)
    }else{
        return res.status(400).json({message:"Error while fetching user data"})
    }
}

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Try bcrypt later for more security
const authUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteUser = async(req, res) => {
    const id = req.params.id
    let user = User.findById(id)
    if(user){
        await User.findByIdAndDelete(id)
        return res.status(200).json({message:"User deleted Successfully"})
    }else{
        return res.status(400).json({message:"User doesn't exist"})
    }

}

module.exports = { getAllUser,registerUser, authUser, deleteUser };
