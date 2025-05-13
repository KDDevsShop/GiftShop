import express from 'express';

import {
  addRole,
  getAllRoles,
  login,
  logout,
  refreshToken,
  signUp,
} from '../controllers/auth.controller.js';

import upload from '../configs/multerConfig.js';
import { auth, isAdmin } from '../middlewares/authentication.js';

const router = express.Router();

router.post('/signup', upload.single('imageFile'), signUp);

router.post('/login', login);

router.post('/logout', auth, logout);

export default router;
