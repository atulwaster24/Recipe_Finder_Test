import mongoose, { Schema } from "mongoose";

const recipeSchema = new mongoose.Schema({
    name: String, 
    ingredients: [{type: String}],
    createdAt: {type: Date, default: Date.now},
    savedBy: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
});

export default recipeSchema;