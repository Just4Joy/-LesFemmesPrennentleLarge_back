import Joi from 'joi';

const Schema = Joi.object({
  firstname: Joi.string().min(3).max(100),
  lastname: Joi.string().min(3).max(100),
  city: Joi.string().min(3).max(100),
  email: Joi.string().email().max(100).required(),
  password: Joi.string().min(8).required(),
  zip_code: Joi.string().max(45),
  profile_pic: Joi.string().max(250),
  id_surf_skill: Joi.number(),
  favorite_spot: Joi.string().max(45),
  created_date: Joi.date().optional(),
  id_departement: Joi.number(),
  id_surf_style: Joi.number(),
  wahine: Joi.boolean().truthy(1).falsy(0),
});

export default Schema;
