import axios from 'axios';

const userRoutes = axios.create({baseURL: "http://localhost:5500/api/user"});


const authRoutes = axios.create({baseURL: 'http://localhost:5500/api/auth'});



export const signin = (data) => authRoutes.post('/signin', data);