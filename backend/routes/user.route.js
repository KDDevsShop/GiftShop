import express from 'express';
import {
  changeAvatar,
  getAllUsers,
  getLoggedInUser,
  getUserById,
  updatePassword,
  updateUserInfo,
} from '../controllers/user.controller.js';
import upload from '../configs/multerConfig.js';
import { auth, isAdmin } from '../middlewares/authentication.js';

const router = express.Router();

router.get('', auth, isAdmin, getAllUsers);

router.get('/current', auth, getLoggedInUser);

router.get('/:id', getUserById);

router.put('/', auth, updateUserInfo);

router.put('/password', auth, updatePassword);

router.put('/avatar', auth, upload.single('avatar'), changeAvatar);

export default router;
