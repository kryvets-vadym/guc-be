import User from '../models/User';
import bcrypt from 'bcryptjs';
import * as tokenService from './tokenService';
import { UserToReturn } from '../types/UserToReturn';
import { ApiError } from '../exceptions/apiError';

export const registration = async (
  email: string,
  name: string,
  password: string,
) => {
  const candidate = await User.findOne({ email });

  if (candidate) {
    throw ApiError.BadRequest('A user with this email already exists!');
  }

  const hashedPassword = bcrypt.hashSync(password, 7);

  const user = new User({
    username: name,
    email,
    password: hashedPassword,
  });

  await user.save();

  const userDto: UserToReturn = { ...user.toJSON() };
  delete userDto.password;

  const tokens = tokenService.generateTokens(userDto);

  await tokenService.saveToken(userDto._id, tokens.refreshToken);
  return { ...tokens, userDto };
}

export const login = async (email: string, password: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw ApiError.BadRequest('No user with this email was found!');
  }

  const isPassEquals = await bcrypt.compare(password, user.password);

  if (!isPassEquals) {
    throw ApiError.BadRequest('Incorrect password entered!');
  }

  const userDto: UserToReturn = { ...user.toJSON() };
  delete userDto.password;

  const tokens = tokenService.generateTokens(userDto);
  await tokenService.saveToken(userDto._id, tokens.refreshToken);

  return { ...tokens, userDto};
}

export const logout = async (refreshToken: string) => {
  const token = await tokenService.removeToken(refreshToken);

  return token;
}

export const refresh = async (refreshToken: string) => {
  if (!refreshToken) {
    throw ApiError.UnauthorizedError();
  }

  const userData = tokenService.validateRefreshToken(refreshToken);
  const tokenFromDb = await tokenService.findToken(refreshToken);

  if (!userData || !tokenFromDb) {
    throw ApiError.UnauthorizedError();
  }

  const user = await User.findById(userData);

  if (!user) {
    throw ApiError.UnauthorizedError();
  }

  const userDto: UserToReturn = { ...user.toJSON() };
  delete userDto.password;

  const tokens = tokenService.generateTokens(userDto);
  await tokenService.saveToken(userDto._id, tokens.refreshToken);

  return { ...tokens, userDto};
};
