import jwt from 'jsonwebtoken';


const Authenticate = async (req, res, next) =>{
    const auth_Header = req.headers.authorization;
    if(!auth_Header){
        return res.status(301).json({message: 'Login to access this page.'})
    }
    const token = auth_Header.split(" ")[1];
    try {
        const payload = jwt.verify(token, 'secret-key');
        delete payload[ "exp", "iat"];
        req.user = {...payload};
        next();
    } catch (error) {
        res.status(500).json({message: error});
    }
};


export default Authenticate;