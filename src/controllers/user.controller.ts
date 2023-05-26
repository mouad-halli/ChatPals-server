import { NextFunction, Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import User from '../models/user'
import bcryptjs from 'bcryptjs'
import { createError } from "../utils/error"
import { SERVER_URL } from "../config/environment"

const { OK, CREATED, BAD_REQUEST } = StatusCodes

const getUser = (req: Request, res: Response, next: NextFunction) => {
    try {
        
        res.status(OK).json('get user called')

    } catch (error) {
        next(error)
    }
}

const getMe = (req: Request, res: Response, next: NextFunction) => {
    res.status(OK).json(req.user)
}

const createUser = (req: Request, res: Response, next: NextFunction) => {
    try {
        
        res.status(CREATED).json('create user called')

    } catch (error) {
        next(error)
    }
}

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.body.email) {
            if (await User.findOne({$and: [{email: req.body.email}, {_id: {$ne: req.user._id}}]}))
                return next(createError(BAD_REQUEST, "email already in use"))
        }

        if (req.body.password) {
            const salt = await bcryptjs.genSalt(10)
            const hash = await bcryptjs.hash(req.body.password, salt)
            req.body.password = hash
        }

        const updatedUserData = await User.findOneAndUpdate(
            {_id: req.user._id},
            { $set: req.body },
            { new: true, fields: { _id: 0, __v: 0 } }
        )

        res.status(OK).json(updatedUserData)

    } catch (error) {
        next(error)
    }
}

const updateUserImage = async (req: Request, res: Response, next: NextFunction) => {
    try {

        if (!req.file)
            return next(createError(BAD_REQUEST, 'please provide an image'))

        const imgPath: string = `${SERVER_URL}/${req.file.path}`

        await User.findOneAndUpdate({_id: req.user._id}, {imgUrl: imgPath})

        res.status(CREATED).json(imgPath)

    } catch (error) {
        next(error)
    }
}

const deleteUser = (req: Request, res: Response, next: NextFunction) => {
    try {
        
        res.status(OK).json('delete user called')

    } catch (error) {
        next(error)
    }
}

export = {
    getUser, createUser, updateUser,
    deleteUser, getMe, updateUserImage
}