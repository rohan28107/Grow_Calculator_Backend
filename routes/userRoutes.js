const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {User} = require('../model/User.model');
const {Profile} = require('../model/User.model.js');
const { Calculation } = require('../model/Calculation.model');


// const app = express();
// app.use(bodyParser.json());
const userRouter = express.Router();


const JWT_SECRET = 'myappsecret';

userRouter.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try{
        bcrypt.hash(password, 5, async(err, hash) => {
            if(err){
                res.send({ 'msg': 'New user is not registered' });
            }else{
                const newUser = new User({
                    name,
                    email,
                    password: hash
                });
                await newUser.save();
                res.send({ 'msg': 'New user is registered' });
                const token = jwt.sign({ userId: newUser._id }, JWT_SECRET);
                return res.status(201).json({ token });
            }
            
        });
        // const token = jwt.sign({ userId: newUser._id }, JWT_SECRET);
        // return res.status(201).json({ token });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

userRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try{
        const user = await User.find({ email });
        if(user.length > 0){
            bcrypt.compare(password, user[0].password, (err, result) => {
                if(result){
                    let token = jwt.sign({ userId: user[0]._id}, JWT_SECRET);
                    res.send({"msg": "New User is authorized", "token": token });
                }else{
                    return res.status(400).json({ message: 'Invalid Email or Password' });
                }
            })
        }
    }
    catch(err){
        console.log(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// userRouter.post('/register', async (req, res) => {
//     try{
//         const { name, email, password } = req.body;
//         const user = await User.findOne({ email });
//         if(user){
//             return res.status(400).json({ message: 'User already registered'});
//         }
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const newUser = new User({
//             name,
//             email,
//             password: hashedPassword
//         });
//         await newUser.save();
//         const newProfile = new Profile({
//             userId: newUser._id
//         });
//         await newProfile.save();
//         const token = jwt.sign({ userId: newUser._id }, JWT_SECRET);
//         return res.status(201).json({ token });
//     }
//     catch(err){
//         console.log(err);
//         return res.status(500).json({ message: 'Internal server error' });
//     }
// });

// userRouter.post('/login', async (req, res) => {
//     try{
//         const { email, password } = req.body;
//         const user = await User.findOne({ email });
//         if(!user){
//             return res.status(400).json({ message: 'Invalid Email or Password' });
//         }
//         const passwordMatch = await bcrypt.compare(password, user.password);
//         if(!passwordMatch){
//             return res.status(400).json({ message: 'Invalid Email or Password' });
//         }
//         const token = jwt.sign({ userId: newUser._id }, JWT_SECRET);
//         return res.json({ token });
//     }
//     catch(err){
//         console.log(err);
//         return res.status(500).json({ message: 'Internal server error' });
//     }
// });

userRouter.get('/profile', async (req, res) => {
    try {
        const token = req.headers.authorization;
        // .split(' ')[1]
        const decodedToken = jwt.verify(token, JWT_SECRET);
        // console.log(decodedToken);
        const user = await User.findById(decodedToken.userId);
        console.log(user._id);
        if(!user){
            return res.status(400).json({ message: 'User not found' });
        }
        // console.log("user id",user._id[0]);
        const profile = await Profile.findOne({ "_id": user._id });
        // console.log(profile);
        if(!profile){
            return res.status(400).json({ message: 'Profile not found' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

userRouter.post('/calculate', async(req, res) =>{
    try {
        const { annualInstalmentAmount, annualInterestRate, totalNumberOfYears } = req.body;
        const rateOfInterest = annualInterestRate / 100;
        const totalNumberOfMonths = totalNumberOfYears * 12;
        const maturityValue = annualInstalmentAmount * ((Math.pow((1 + rateOfInterest), totalNumberOfMonths) - 1) / rateOfInterest);
        const totalInvestmentAmount = annualInstalmentAmount * totalNumberOfYears;
        const totalInterestGained = maturityValue - totalInvestmentAmount;
        return res.json({
            totalInvestmentAmount,
            totalInterestGained,
            maturityValue
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server error', error: error.message });
    }
})

module.exports = {
    userRouter
}