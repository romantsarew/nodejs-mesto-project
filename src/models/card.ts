import { model, Schema, Types } from 'mongoose';
import { Joi } from 'celebrate';
import validator from 'validator';

export interface ICard {
  name: string;
  link: string;
  owner: Types.ObjectId;
  likes: Types.ObjectId[];
  createdAt: Date;
}

const urlRegex = /^(https?:\/\/)(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]*)?#?$/;

const cardSchema = new Schema<ICard>(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    link: {
      type: String,
      required: true,
      validate: {
        validator: (v: string) => urlRegex.test(v),
        message: 'Неправильный формат URL',
      },
    },
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'user',
    },
    likes: {
      type: [Schema.Types.ObjectId],
      ref: 'user',
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  },
);

export const cardJoiSchema = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  link: Joi.string().uri().required(),
});

export const cardIdJoiSchema = Joi.object({
  cardId: Joi.string().hex().length(24).required(),
});

export default model<ICard>('card', cardSchema);
