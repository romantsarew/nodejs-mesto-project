import { Joi } from 'celebrate';

export const signInValidation = Joi.object().keys({
  email: Joi.string().required().email(),
  password: Joi.string().required(),
});

export const signUpValidation = Joi.object().keys({
  name: Joi.string().min(2).max(30),
  about: Joi.string().min(2).max(200),
  avatar: Joi.string().uri(),
  email: Joi.string().required().email(),
  password: Joi.string().required(),
});

export const userIdValidation = Joi.object().keys({
  userId: Joi.string().required().hex().length(24),
});

export const updateUserValidation = Joi.object().keys({
  name: Joi.string().required().min(2).max(30),
  about: Joi.string().required().min(2).max(200),
});

export const updateAvatarValidation = Joi.object().keys({
  avatar: Joi.string().required().uri(),
});

export const cardBodyValidation = Joi.object().keys({
  name: Joi.string().required().min(2).max(30),
  link: Joi.string().required().uri(),
});

export const cardIdValidation = Joi.object().keys({
  cardId: Joi.string().required().hex().length(24),
});
