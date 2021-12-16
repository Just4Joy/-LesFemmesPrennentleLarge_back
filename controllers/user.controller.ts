const userController = require('express').Router();
const User = require('../models/user.model')
import {Request, Response} from 'express'

userController.get('/', async (req: Request, res: Response) => {
const result = await User.findMany()
res.status(200).json(result)
})

module.exports = { userController } 

