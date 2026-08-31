import { genToken } from "../config/token.js"
import User from "../model/user.model.js"
import bcrypt from "bcrypt"

// signUp
export async function signup (req,res){
    try{
        const {userName,name,password,email}= req.body

        const CheckUser = await User.findOne({userName})
        if(CheckUser){
            return res.status(400).json({message:"User already exist"})
        }

        if(password.length<6){
            return res.status(400).json({message:"password must be at least 6 charecters"})
        }

        const checkEmail = await User.findOne({email})
        if(checkEmail){
            return res.status(400).json({message:"Email Alredy exist"})
        }

        const hassPass = await bcrypt.hash(password,10)

        const user = await User.create({
            userName,
            name,
            email,
            password:hassPass
        })

        const token = await genToken(user._id)

        res.cookie("token",token,{
            httpOnly:true,
            maxAge:7*24*60*1000,
            sameSite:"Strict",
            secure:false
        }
        )

        return res.status(201).json({message:"User signup success",user,token})


    }catch(err){
        console.log(err)
        res.status(500).json({message:`Signup error ${err}`})
    }
}


// Login 

export async function login (req,res){
    try{
        const {email,password} = req.body

        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"User not found"})
        }

        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({message:"Incorrect Passwword"})
        }

        const token = await genToken(user._id)

        res.cookie("token",token,{
            httpOnly:true,
            maxAge:7*24*60*1000,
            sameSite:"Strict",
            secure:false
        })

        return res.status(200).json({message:"User login success",user,token})

    }catch(err){
        console.log(err)
        res.status(500).json({message:`User Login Error ${err}`})
    }
}

//Logout

export async function logout(req,res) {
    try{
        res.clearCookie("token")
        return res.status(200).json({message:"Logout successfuly"})

    }catch(err){
        console.log(err)
        return res.status(500).json({message:`Logout error ${err}` })
    }
}