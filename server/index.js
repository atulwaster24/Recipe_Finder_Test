import express, { urlencoded } from 'express';
import cors from 'cors';
import session from 'express-session';
import connectToDB from './config/Database.js';
import userRouter from './routes/userRoutes.js';
import authRouter from './routes/authRoutes.js';

const app = express();
app.use(urlencoded({extended:true}))
app.use(express.json());
app.use(cors());

app.use(session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}))

app.get('/api', (req, res)=>{
    res.send("Welcome to Recipe Finder API.")
});
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter)



app.use((req, res, next)=>{
    res.status(404).send("Sorry, can't find resources for the enterd URL.")
})

const PORT = 5500;
app.listen(PORT, ()=>{
    console.log(`Server is successfully listening at Port: ${PORT}`);
    connectToDB();
});