import { User, UserRole } from '../models/user.model.js';
import { isValidObjectId } from '../utils/isValidObjectId.js';
import { validateEmail, validatePhone } from '../utils/validation.js';
import bcrypt from 'bcrypt';

class UserService {
  async getUserById(userId) {
    if (!userId || !isValidObjectId(userId)) {
      throw new Error('Invalid Id');
    }
    const user = await User.findById(userId)
      .select('-password -refreshToken')
      .populate('role');
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async getAllUsers(filters) {
    const {
      fullname = '',
      email = '',
      role = '',
      page = 1,
      limit = 10,
    } = filters;
    const query = {};

    if (fullname) query.fullname = { $regex: fullname, $options: 'i' };
    if (email) query.email = { $regex: email, $options: 'i' };

    if (role) {
      const existingRole = await UserRole.findOne({ role });
      if (existingRole) query.role = existingRole._id;
    }

    const users = await User.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('role');

    const totalDocs = await User.countDocuments(query);
    const totalPages = Math.ceil(totalDocs / limit);

    return { users, totalDocs, totalPages, currentPage: page, limit };
  }

  async updateUserInfo(userId, updates) {
    if (!userId || !isValidObjectId(userId)) {
      throw new Error('Invalid Id');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const { fullname, email, phone, gender, dateOfBirth } = updates;

    if (email && !validateEmail(email)) {
      throw new Error('Invalid Email');
    }

    if (phone && !validatePhone(phone)) {
      throw new Error('Invalid phone number');
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        fullname: fullname || user.fullname,
        email: email || user.email,
        phone: phone || user.phone,
        gender: gender || user.gender,
        dateOfBirth: dateOfBirth || user.dateOfBirth,
      },
      { new: true, runValidators: true }
    );

    return updatedUser;
  }

  async changeAvatar(userId, avatarImagePath) {
    if (!userId || !isValidObjectId(userId)) {
      throw new Error('Invalid Id');
    }
    if (!avatarImagePath) {
      throw new Error('Missing file');
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatarImagePath },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      throw new Error('User not found');
    }
    return updatedUser;
  }

  async updatePassword(userId, oldPassword, newPassword, confirmPassword) {
    if (!userId || !isValidObjectId(userId)) {
      throw new Error('Invalid Id');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new Error('Incorrect old password');
    }

    if (newPassword !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    return { message: 'Password updated successfully' };
  }
}

export default new UserService();
