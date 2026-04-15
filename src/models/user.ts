import {
  model, Schema, Model, HydratedDocument,
} from 'mongoose';
import { Joi } from 'celebrate';
import validator from 'validator';
import bcrypt from 'bcryptjs';

export interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

type TUserDocument = HydratedDocument<IUser>;

interface IUserModel extends Model<IUser> {
  findUserByCredentials(
    email: string,
    password: string,
  ): Promise<TUserDocument>;
}

const urlRegex = /^(https?:\/\/)(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]*)?#?$/;

const userSchema = new Schema<IUser, IUserModel>(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      minlength: 2,
      maxlength: 200,
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      default:
        'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator: (v: string) => urlRegex.test(v),
        message: 'Неправильный формат URL',
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v: string) => validator.isEmail(v),
        message: 'Неправильный формат email',
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    versionKey: false,
  },
);

userSchema.static(
  'findUserByCredentials',
  function findUserByCredentials(
    email: string,
    password: string,
  ): Promise<TUserDocument> {
    return this.findOne({ email })
      .select('+password')
      .then((user) => {
        if (!user) {
          return Promise.reject(new Error('Неправильные почта или пароль'));
        }

        return bcrypt.compare(password, user.password).then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }

          return user;
        });
      });
  },
);

export const userJoiSchema = Joi.object({
  name: Joi.string().min(2).max(30),
  about: Joi.string().min(2).max(200),
  avatar: Joi.string().uri(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const userIdJoiSchema = Joi.object({
  userId: Joi.string().hex().length(24).required(),
});

export default model<IUser, IUserModel>('User', userSchema);
