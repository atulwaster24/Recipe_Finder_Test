import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    name: {type: String, required: true}, 
    username: {type: String, required: true, unique: true}, 
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    type: {
        type: String, enum: ['user', 'admin']
    },
    resetToken: String,
    resetTokenExpiry: Date
    // savedRecipes: [{
    //     type: Schema.Types.ObjectId,
    //     ref: 'Recipe'
    // }]
});

userSchema.pre('save', async function(next){
    const user = this;

    if(!user.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(12);

        const hashedPassword = await bcrypt.hash(user.password, salt);

        user.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

export default userSchema;