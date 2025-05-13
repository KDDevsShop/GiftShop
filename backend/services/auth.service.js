import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, UserRole } from '../models/user.model.js';
import generateToken from '../utils/generateToken.js';
import {
  validateEmail,
  validatePhone,
  validRoles,
} from '../utils/validation.js';
import {
  CredentialsError,
  NotFoundError,
  ValidationError,
} from '../utils/Error.js';
import { isValidObjectId } from '../utils/isValidObjectId.js';

class AuthService {
  async addRole(role) {
    try {
      if (!validRoles.includes(role)) {
        throw new Error('Invalid role!');
      }

      const existingRole = await UserRole.findOne({ role });

      if (existingRole) {
        throw new Error('This role already exists!');
      }

      const newRole = await UserRole.create({ role });
      return newRole;
    } catch (error) {
      throw error;
    }
  }

  async getAllRoles() {
    try {
      const roles = await UserRole.find();

      if (!roles || roles.length === 0) {
        throw new Error('Roles not found!');
      }

      return roles;
    } catch (error) {
      throw error;
    }
  }

  async signUp({
    fullname,
    email,
    password,
    confirmPassword,
    phone,
    gender,
    dateOfBirth,
    role = 'customer',
    imageFile,
  }) {
    try {
      if (
        !fullname ||
        !email ||
        !password ||
        !phone ||
        !gender ||
        !dateOfBirth
      ) {
        throw new ValidationError('Missing required fields!');
      }

      if (!validateEmail(email)) {
        throw new ValidationError('Invalid email format!');
      }

      if (!validatePhone(phone)) {
        throw new ValidationError('Invalid phone number format!');
      }

      if (password.length < 8) {
        throw new ValidationError('Password must be at least 8 characters!');
      }

      if (password !== confirmPassword) {
        throw new ValidationError('Passwords do not match!');
      }

      if (!validRoles.includes(role)) {
        throw new ValidationError('Invalid role!');
      }

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        throw new NotFoundError('Email already exists!');
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const roleId = (await UserRole.findOne({ role }))?._id;

      if (!isValidObjectId(roleId)) {
        throw new NotFoundError('Invalid role');
      }

      const newUser = new User({
        fullname,
        email,
        password: hashedPassword,
        phone,
        gender,
        dateOfBirth,
        avatarImagePath: imageFile,
        role: roleId,
      });

      const { accessToken, refreshToken } = generateToken({
        userId: newUser._id,
      });

      newUser.refreshToken = refreshToken;

      await newUser.save();

      return {
        userId: newUser._id,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw error;
    }
  }

  async login({ email, password }) {
    try {
      if (!email || !password) {
        throw new ValidationError('Missing required fields!');
      }

      if (!validateEmail(email)) {
        throw new ValidationError('Invalid email format!');
      }

      const existingUser = await User.findOne({ email });

      if (!existingUser) {
        throw new NotFoundError('User not found!');
      }

      const isMatch = await bcrypt.compare(password, existingUser.password);

      if (!isMatch) {
        throw new CredentialsError('Invalid credentials!');
      }

      const { accessToken, refreshToken } = generateToken({
        userId: existingUser._id,
      });

      existingUser.refreshToken = refreshToken;
      await existingUser.save();

      return {
        userId: existingUser._id,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw error;
    }
  }

  async refreshToken(refreshToken) {
    try {
      return new Promise((resolve, reject) => {
        jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET,
          async (error, payload) => {
            if (error) {
              return reject(error);
            }

            const existingUser = await User.findById(payload.userId);
            if (!existingUser) {
              throw new Error('User not found!');
            }

            const token = generateToken({ userId: existingUser._id });

            existingUser.refreshToken = token.refreshToken;
            await existingUser.save();

            resolve({
              accessToken: token.accessToken,
              refreshToken: token.refreshToken,
            });
          }
        );
      });
    } catch (error) {
      throw error;
    }
  }

  async logout(userId) {
    try {
      const existingUser = await User.findById(userId);

      if (!existingUser) {
        throw new Error('User not found!');
      }

      existingUser.refreshToken = null;
      await existingUser.save();

      return;
    } catch (error) {
      throw error;
    }
  }
}

export default new AuthService();
