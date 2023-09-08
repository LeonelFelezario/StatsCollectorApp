import express from 'express';
import { registerUser, authUser, logoutUser, getUserProfile } from  '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser)
router.post('/login', authUser)
router.route('/logout').post(logoutUser)
router.route('/getuserprofile').get( protect, getUserProfile)

export default router;