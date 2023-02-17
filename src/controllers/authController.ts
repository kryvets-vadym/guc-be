import { Request, Response } from 'express';
import * as authService from '../service/authService';
import { validateRegisterInput } from '../helpers/registerValidation';
import { ApiError } from '../exceptions/apiError';

export const registration = async (req: Request, res: Response) => {
  const { isValid, errors } = validateRegisterInput(req.body);

  if (!isValid) {
    throw ApiError.BadRequest('Error in validating incoming data', errors);
  }

  const { email, username, password } = req.body;

  const userData = await authService.registration(
    email,
    username,
    password,
  );

  res.cookie('refresh-token', userData.refreshToken, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  })

  return res.json(userData);
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const userData = await authService.login(email, password);

  res.cookie('refresh-token', userData.refreshToken, {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  })

  return res.json(userData);
};

export const logout = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const token = await authService.logout(refreshToken);
  res.clearCookie('refresh-token');

  return res.json(token);
};

export const refresh = async (req: Request, res: Response) => {
  const refreshToken = req.cookies['refresh-token'];
  const userData = await authService.refresh(refreshToken);

  res.cookie('refresh-token', userData.refreshToken, {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  })

  return res.json(userData);
};
