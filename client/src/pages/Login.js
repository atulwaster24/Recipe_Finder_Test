import React, { useState } from "react";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [userInfo, setUserInfo] = useState({username: "", email: "", password: ""});
    const [input, setInput] = useState('')

    function handleLogin(e){
        e.preventDefault();

        // setUser()
        console.log(userInfo);
    }

    function handleInput(e){
        e.preventDefault();
        console.log(input)
        if(input.includes('@')){
            setInput(e.target.value);
            return setUserInfo({...userInfo, email: e.target.value, username: null});
        }else{
            setInput(e.target.value)
            return setUserInfo({...userInfo, username: e.target.value, email: null});
        }
    };

  return (
    <div className="flex justify-center">
      <form className="border-2 flex flex-col gap-8 border-violet-300 w-full md:w-1/3 lg:w-1/4 rounded-xl p-10" onSubmit={handleLogin}>
        <h1 className="text-4xl font-bold underline">Login</h1>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="w-full flex justify-start font-bold">Username or Email</label>
            <input type="text" onChange={(e)=> handleInput(e)} value={input} className="rounded-md px-2 bg-neutral-700 text-white" required></input>
          </div>
          <div className="flex flex-col gap-1">
            <label className="w-full flex justify-start font-bold">Password</label>
            <div className="flex items-center relative"><input type={showPassword? 'text' : 'password'} className="rounded-md px-2 bg-neutral-700 text-white" onChange={(e)=> setUserInfo({...userInfo, password: e.target.value})} value={userInfo.password} required></input>
            {showPassword ? <BiSolidHide className="absolute left-[90%]"onClick={()=>setShowPassword(!showPassword)} fontSize={20}/>: <BiSolidShow className="absolute left-[90%]"onClick={()=>setShowPassword(!showPassword)} fontSize={20} />}</div>
          </div>
        </div>
        <div>
        <button type="submit" className="border-2 rounded-xl w-24 text-violet-600 font-bold hover:text-white hover:bg-violet-600 p-2 hover:scale-110 transition-transform duration-300">Login</button>
        <div className="w-full flex justify-end mt-2">
            <a href="/forgot-password" className="hover:text-blue-500">Forgot Password?</a>
        </div>
        </div>
        <div className="mt-4 hover:scale-105 transition-transform duration-200">
            <a href="/register" className="hover:border-2 border-violet-400 p-2 rounded-md">Create an Account Now</a>
        </div>
      </form>
    </div>
  );
};

export default Login;
