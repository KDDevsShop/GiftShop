import logError from '../utils/logError.js';
import authService from '../services/auth.service.js';

export const addRole = async (req, res) => {
  try {
    const { role } = req.body;
    const newRole = await authService.addRole(role);
    res.status(201).json({ data: newRole, error: false });
  } catch (error) {
    logError(error, res);
  }
};

export const getAllRoles = async (req, res) => {
  try {
    const roles = await authService.getAllRoles();
    res.status(200).json({ data: roles, error: false });
  } catch (error) {
    logError(error, res);
  }
};

export const signUp = async (req, res) => {
  try {
    const userData = await authService.signUp({
      ...req.body,
      avatarImagePath: req.file?.path || '',
    });
    res.status(201).json({
      data: userData,
      error: false,
      message: 'User created successfully!',
    });
  } catch (error) {
    logError(error, res);
  }
};

export const login = async (req, res) => {
  try {
    const userData = await authService.login(req.body);
    res.status(200).json({ data: userData, error: false });
  } catch (error) {
    logError(error, res);
  }
};

export const refreshToken = async (req, res) => {
  try {
    const tokens = await authService.refreshToken(req.body.refreshToken);
    res.status(200).json({ data: tokens, error: false });
  } catch (error) {
    logError(error, res);
  }
};

export const logout = async (req, res) => {
  try {
    const { userId } = req.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = await authService.logout(userId);
    res.status(200).json({ data: user, error: false });
  } catch (error) {
    logError(error, res);
  }
};
