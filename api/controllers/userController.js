import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import { hashPassword, comparePassword } from '../utils/helpers.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


const registerUser = asyncHandler(async (req, res) => {

    try {

        const { username } = req.body;

        const password = hashPassword(req.body.password);

        const newUser = await prisma.user.create({
            data: {
                username,
                password,
            }
        });

        return res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {

        throw new Error(error);

    } finally {

        await prisma.$disconnect();
        
    }
});

const authUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    try {
    const user = await prisma.user.findUnique({
        where: { username },
    });

    if (!user) { 
      res.status(404);
      throw new Error('User not found');
    } 

    const passwordMatch = await comparePassword(password, user.password)
    
    if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    
    generateToken(res, user.id);

    res.json({
          id: user.id,
          username: user.username,
          level: user.level
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Login failed' });
    }
});

const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    })

    res.status(200).json({ message: 'User Logged Out'})
});

const getUserProfile = asyncHandler(async (req, res) => {
    try {

    const userProfile = await prisma.user.findUnique({
        where: { id: req.user.id },
    });

    if (userProfile) {
      res.json({
        id: userProfile.id,
        username: userProfile.username
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }

    } catch (error) {

        throw new Error(error);

    }

});

export {
    registerUser,
    authUser,
    logoutUser,
    getUserProfile
}