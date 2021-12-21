import Joi from 'joi';

const Schema = Joi.object({
  firstname: Joi.string().min(3).max(100),
  lastname: Joi.string().min(3).max(100),
  city: Joi.string().min(3).max(100),
  email: Joi.string().email().max(100).required(),
  password: Joi.string().min(8).required(),
  zipCode: Joi.string().max(45),
  profilePic: Joi.object(),
  idSurfSkill: Joi.number(),
  favoriteSpot: Joi.string().max(45),
  createdDate: Joi.date(),
  idDepartement: Joi.number(),
  idSurfStyle: Joi.number(),
});

export default Schema;
