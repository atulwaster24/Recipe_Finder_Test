import mongoose from "mongoose";

const URL = 'mongodb://localhost:27017';

const connectToDB = async () => {
    try {
        await mongoose.connect(URL);
        console.log("Connection to Database successful.");
    } catch (error) {
        console.log(error);
    }
};


export default connectToDB;