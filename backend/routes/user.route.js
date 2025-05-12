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

const router = express.Router();

router.get('', getAllUsers);

router.get('/:id', getUserById);

router.get('/current', getLoggedInUser);

router.put('/', updateUserInfo);

router.put('/password', updatePassword);

router.put('/avatar', upload.single('avatar'), changeAvatar);

export default router;
