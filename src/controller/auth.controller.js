import { genAccessToken, genRefreshToken } from "../config/token.js"
import User from "../model/user.model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export async function signup(req,res){
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

        const accessToken = await genAccessToken(user._id)
        const refreshToken = await genRefreshToken(user._id)

        user.refreshToken = refreshToken
        await user.save()

        res.cookie("accessToken", accessToken, { httpOnly:true, maxAge:15*60*1000, sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict", secure: process.env.NODE_ENV === "production" })
        res.cookie("refreshToken", refreshToken, { httpOnly:true, maxAge:7*24*60*60*1000, sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict", secure: process.env.NODE_ENV === "production" })

        return res.status(201).json({message:"User signup success", user, accessToken})
    }catch(err){
        console.log(err)
        res.status(500).json({message:`Signup error ${err}`})
    }
}

export async function login(req,res){
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

        const accessToken = await genAccessToken(user._id)
        const refreshToken = await genRefreshToken(user._id)

        user.refreshToken = refreshToken
        await user.save()

        res.cookie("accessToken", accessToken, { httpOnly:true, maxAge:15*60*1000, sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict", secure: process.env.NODE_ENV === "production" })
        res.cookie("refreshToken", refreshToken, { httpOnly:true, maxAge:7*24*60*60*1000, sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict", secure: process.env.NODE_ENV === "production" })

        return res.status(200).json({message:"User login success", user, accessToken})
    }catch(err){
        console.log(err)
        res.status(500).json({message:`User Login Error ${err}`})
    }
}

export async function logout(req,res) {
    try{
        if (req.cookies.refreshToken) {
            const user = await User.findOne({ refreshToken: req.cookies.refreshToken })
            if (user) {
                user.refreshToken = ""
                await user.save()
            }
        }
        const cookieOptions = { httpOnly:true, sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict", secure: process.env.NODE_ENV === "production" };
        res.clearCookie("accessToken", cookieOptions)
        res.clearCookie("refreshToken", cookieOptions)
        return res.status(200).json({message:"Logout successfuly"})
    }catch(err){
        console.log(err)
        return res.status(500).json({message:`Logout error ${err}` })
    }
}

export async function refresh(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken
        const cookieOptions = { httpOnly:true, sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict", secure: process.env.NODE_ENV === "production" };
        
        if (!refreshToken) {
            res.clearCookie("accessToken", cookieOptions);
            res.clearCookie("refreshToken", cookieOptions);
            return res.status(401).json({ message: "No refresh token provided" })
        }

        const user = await User.findOne({ refreshToken })
        if (!user) {
            res.clearCookie("accessToken", cookieOptions);
            res.clearCookie("refreshToken", cookieOptions);
            return res.status(403).json({ message: "Invalid refresh token" })
        }

        jwt.verify(refreshToken, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                res.clearCookie("accessToken", cookieOptions);
                res.clearCookie("refreshToken", cookieOptions);
                return res.status(403).json({ message: "Refresh token expired or invalid" })
            }
            
            const accessToken = await genAccessToken(user._id)
            res.cookie("accessToken", accessToken, { httpOnly:true, maxAge:15*60*1000, sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict", secure: process.env.NODE_ENV === "production" })
            return res.status(200).json({ message: "Token refreshed successfully", accessToken })
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: `Refresh token error ${err}` })
    }
}

export async function google(req,res){
    try{
        const {email, name, photoURL} = req.body
        let user = await User.findOne({email})

        if(!user){
            const userName = email.split('@')[0] + Math.floor(Math.random() * 10000)
            const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
            const hassPass = await bcrypt.hash(randomPassword, 10)
            
            user = await User.create({
                userName,
                name,
                email,
                password: hassPass,
                image: photoURL
            })
        }

        const accessToken = await genAccessToken(user._id)
        const refreshToken = await genRefreshToken(user._id)

        user.refreshToken = refreshToken
        if(photoURL && !user.image) {
            user.image = photoURL
        }
        await user.save()

        res.cookie("accessToken", accessToken, { httpOnly:true, maxAge:15*60*1000, sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict", secure: process.env.NODE_ENV === "production" })
        res.cookie("refreshToken", refreshToken, { httpOnly:true, maxAge:7*24*60*60*1000, sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict", secure: process.env.NODE_ENV === "production" })

        return res.status(200).json({message:"Google Sign-In success", user, accessToken})
    }catch(err){
        console.log("Google Auth Error:", err)
        return res.status(500).json({message: "Google Auth Error", error: err.message})
    }
}
