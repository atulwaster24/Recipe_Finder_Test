import nodemailer from 'nodemailer';

export const sendMail = (email, token, res) =>{
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user: "atulwasterstar@gmail.com",
            pass: "nspj jnrl mugu izbv"
        }
    });

    const mailOptions = {
        from: 'atulwasterstar@gmail.com',
        to: email,
        subject: "Password Reset",
        html: `<div>
            <a href="http://localhost:5500/api/user/reset-password/${token}"><button type='button'>Reset Password</button></a>
        </div>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if(error){
            console.log(error);
            return res.status(500).json({message: "Failed to send reset password email. Try Later."})
        }else{
            console.log(info.response);
            return res.status(200).json({message: "Email with password reset link is sent."});
        }
    })
}