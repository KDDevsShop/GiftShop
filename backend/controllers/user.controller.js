import userService from '../services/user.service.js';
import logError from '../utils/logError.js';

export const getLoggedInUser = async (req, res) => {
  try {
    const { userId } = req.userId;
    console.log('req.userId ' + req.userId);
    if (!userId) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = await userService.getUserById(userId);
    res.status(200).json({ data: user, error: false });
  } catch (error) {
    logError(error, res);
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const data = await userService.getAllUsers(req.query);
    res.status(200).json({
      data: data.users,
      error: false,
      meta: {
        totalDocs: data.totalDocs,
        totalPages: data.totalPages,
        currentPage: data.currentPage,
        limit: data.limit,
      },
    });
  } catch (error) {
    logError(error, res);
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json({ data: user, error: false });
  } catch (error) {
    logError(error, res);
  }
};

export const updateUserInfo = async (req, res) => {
  try {
    console.log(req.userId);
    const updatedUser = await userService.updateUserInfo(
      req.userId.userId,
      req.body
    );
    res.status(200).json({ data: updatedUser, error: false });
  } catch (error) {
    logError(error, res);
  }
};

export const changeAvatar = async (req, res) => {
  try {
    const updatedUser = await userService.changeAvatar(
      req.userId.userId,
      req.file?.path
    );
    res.status(200).json({ data: updatedUser, error: false });
  } catch (error) {
    logError(error, res);
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { oldPassword, password, confirmPassword } = req.body;
    const result = await userService.updatePassword(
      req.userId.userId,
      oldPassword,
      password,
      confirmPassword
    );
    res.status(200).json({ message: result.message, error: false });
  } catch (error) {
    logError(error, res);
  }
};
