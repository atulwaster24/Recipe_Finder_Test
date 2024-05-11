// importing required modules
import crypto from 'crypto';
import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import userSchema from "../config/schemas/userSchema.js";
import { sendMail } from '../utils/mails/PasswordResetMail.js';


/** Create a User Model */
const UserModel = mongoose.model('User', userSchema);

export const signup = async (req, res) => {
    const { name, username, email, password, type} = req.body;
    try {
        // Creating a new user using userSchema
        const newUser = new UserModel({
            name: name,
            username,
            email,
            password, 
            type,
            createdAt: new Date()
        });

        const savedUser = await newUser.save();
        if(savedUser){
            // if user is saved to the Database send response.
            const user = {...savedUser._doc};
            delete user['password'];

            const token = jwt.sign({userId: user._id, username: user.username, email: user.email}, 'secret-key', {expiresIn: '1d'});
                res.cookie('token', token);

                req.session.token = token;

            res.status(201).json({message: `Welcome ${savedUser.name}`, user, token});
        }
        else{
            // user is not saved so send reponse message.
            res.status(400).json({message: "Bad Request. Try Again Later."})
        }

    } catch (error) {
        // Following statement is to check if the email or username user has entered, already has an account created. If either username or email is already registered send response respectively.
        if(error.keyPattern){
            let pattern = Object.keys(error.keyPattern)[0];
            return res.status(401).json({message: `User with ${pattern}: ${error.keyValue[pattern]} already exists.`})
        }
        // Any other Database errors
        res.status(500).json({message: error});
    }
}; 

export const signin = async (req, res) => {
    const {username, email, password} = req.body;

    try {
        let existingUser = null;

        // This conditional statement check whether user has provided username or email and checks if the user with provided details exists.
        if(username){
            existingUser = await UserModel.findOne({username}).exec();
        }else{
            existingUser = await UserModel.findOne({email}).exec();
        }

        
        if(existingUser){
            // checking if the password entered is correct
            let validUser = await bcrypt.compare(password, existingUser.password);

            if(validUser){
                let user = {...existingUser._doc};
                delete user["password"];

                // create and send jwt token as token to cookie.
                const token = jwt.sign({userId: user._id, username: user.username, email: user.email}, 'secret-key', {expiresIn: '1d'});
                res.cookie('token', token);

                req.session.token = token;

                // if no errors are encountered this response will be send.
                return res.status(200).json({message: "Login Successful.", token});
            }else{
                // if the validUser = false; That means the password entered was incorrect.
                return res.status(400).json({message: "Incorrect Password."});
            }
        }else{
            // Depending on the login info (username or email) the error will be shown because no user with provided login info was found.
            return res.status(404).json({message: `User not found. Incorrect ${username? "username" : email ? "email" : "username or email"}.`});
        }

    } catch (error) {
        res.status(500).json({message: error});
    }
};

export const getUser = async (req, res) => {
    const {userId} = req.params;
    try {
        const existingUser = await UserModel.findById(userId);
        if(!existingUser){
            return res.status(404).json({message: "User not found."})
        }
        let user = {...existingUser._doc};
        delete user['password'];
        
        return res.status(200).json({user});
    } catch (error) {
        if(error.name === "CastError"){
            return res.status(400).json({message: "Incorrect user id. Please re-enter correct user id."});
        }
        return res.status(500).json({message: error});
    }
};

export const updateUser = async (req, res) => {
    const {info, userId} = req.params;
    const updatedData = req.body;

    try {
        
        if(info === "username"){
            let exists = await UserModel.findOne({username: updatedData.username});
            if(exists){
                return res.status(400).json({message: "Username already exists. Try different username."});
            }
        }
    
        if(info === "email"){
            let exists = await UserModel.findOne({email: updatedData.email});
            if(exists){
                return res.status(400).json({message: "Email already exists. Try different email address."});
            }
        }
    
        if(info === "password"){
            let user = await UserModel.findById(userId);
            if(!user){
                return res.status(404).json({message: "User not found."})
            }
    
            const currentPasswordIsValid = await bcrypt.compare(updatedData.password, user.password);
    

            if(!currentPasswordIsValid){
                return res.status(400).json({message: 'Incorrect Current Password.'})
            }
    
            if(updatedData.newPassword !== updatedData.confirmPassword){
                return res.status(400).json({message: "Passwords didnt match."})
            }
    
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({message: error});
    }

    try {
        if(info === "password"){
            const currentUser = await UserModel.findById(userId);
            currentUser.password = updatedData.newPassword;
            await currentUser.save();

            const user = {...currentUser._doc};
            delete user["password"];

            if(currentUser){
                return res.status(200).json({message: "Password updated successfully.", user});
            }
        }

        const updatedUser = await UserModel.findByIdAndUpdate(userId, updatedData, {new: true});
        if(updatedUser){

            const user = {...updatedUser._doc};
            delete user["password"];


            return res.status(200).json({message: `${info} updated successfully.`, user});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error});
    }
};

export const deleteUser = async (req, res) => {
    const {userId} = req.params;
    try {
        const deletedUser = await UserModel.findByIdAndDelete(userId);
        if(!deletedUser){
            return res.status(401).json({message: "User not found."})
        }
        let user = {...deletedUser?._doc};
        delete user["password"];
        return res.status(200).json({message: "Deleted Successfully.", user})
    } catch (error) {
        if(error.name === "CastError"){
            return res.status(400).json({message: "Incorrect user id. Please re-enter correct user id."});
        }
        res.status(500).json({message: error});
    }
};


export const forgotPassword = async (req, res) => {
    const {email} = req.body;
    try {
        
        const token = crypto.randomBytes(20).toString('hex');
        const existingUser = await UserModel.findOne({email});
        if(!existingUser){
            return res.status(404).json({message: `No user with email: ${email} found.`})
        }

        await UserModel.findOneAndUpdate({email}, {resetToken: token, resetTokenExpiry:  Date.now() + 3600000});

        sendMail(email, token, res);
    } catch (error) {
        res.status(500).json({message: error});
    }
};

export const resetPasswordGET = async (req, res) => {
    const {token} = req.params;

    try {
        const user = await UserModel.findOne({resetToken: token, resetTokenExpiry: { $gt: Date.now() }});
        let userWithoutPassword = {...user._doc};
        delete userWithoutPassword["password"];

        if(!user){
            return res.status(400).json({error: 'Invalid or expired token'});
        }
        res.status(200).json({user: userWithoutPassword});
    } catch (error) {
        res.status(500).json({message: error});
    }
};

export const resetPasswordPOST = async (req, res) => {
    const {token} = req.params;
    const {newPassword, confirmPassword} = req.body;

    if(newPassword !== confirmPassword){
        return res.status(300).json({message: "Passwords didn't match."})
    }

    try {
        const user = await UserModel.findOne({resetToken: token, resetTokenExpiry: {$gt: Date.now()}});

        if(!user){
            return res.status(400).json({message: "Invalid or expired token."});
        };

        user.password = newPassword;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        res.status(200).json({message: "Password reset Successful."})
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error});
    }

};


export const logout = async (req, res) => {
    try {
        res.clearCookie('token');
        req.user = null;
        req.session.destroy();
        res.clearCookie('connect.sid');
        res.status(200).json({message: "Logout Successful."})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Failed to Logout. Try again after some time."})
    }
}