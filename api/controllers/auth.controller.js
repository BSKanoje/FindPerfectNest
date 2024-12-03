import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from '@prisma/client';
//import prisma from "../lib/prisma.js";
import { userInfo } from "os";

const prisma = new PrismaClient();

export const register = async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        // HASH THE PASSWORD
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);

        // CREATE A NEW USER AND SAVE TO DB
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                role, // Use role from req.body
            },
        });

        console.log(newUser);
        return res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Failed to create user!", error: err.message });
    }
};


export const login = async (req, res)=>{
    const{ username, password }=req.body;

    try{
        //CHECK IF THE USER EXITS

        const user = await prisma.user.findUnique({
            where:{username},
        })

        if (!user) return res.status(401).json({message: "Invalid Credentials!"});

        //CHECK IF THE PASSWORD IS CORRECT

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid) return res.status(401).json({message: "Invalid Credentials!"});

        //GENERATE COOKIE TOKEN AND SEND TO THE USER
        //res.setHeader("Set-Cookie", "test=" + "myValue").json("success");

        const age = 1000 * 60 * 60 * 24 * 7;

        const token = jwt.sign({
            id: user.id,
            isAdmin: false,
        }, process.env.JWT_SECRET_KEY,{expiresIn:age});

        const{ password: userPassword, ...userInfo } = user;

        res.cookie("token",token,{
            httpOnly:true,
            //secure:true
            maxAge: age,
        }).status(200).json(userInfo);
    }catch(err){
        console.log(err);
        return res.status(500).json({message: "failed to login!",error: err.message});
        
    }          
};

export const logout = (req, res)=>{
    res.clearCookie("token").status(200).json({message: "Logout Successful"});
};