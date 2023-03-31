import { NextFunction, Request, Response } from "express"
import { createError } from "../utils/error"
import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'
import { ACCESS_TOKEN_SECRET } from "../config/environment"
import User from '../models/users'
import { tokenPayload } from "../types/token"

const { UNAUTHORIZED, NOT_FOUND } = StatusCodes

export const verifyAuthentication = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const accessToken = req.cookies.accessToken

        if (!accessToken)
            return next(createError(UNAUTHORIZED, 'you are not authenticated'))

        try {
            const { _id: userId } = jwt.verify(accessToken, ACCESS_TOKEN_SECRET) as tokenPayload
            
            const user = await User.findById(userId).select("+accessToken")

            if (!user)
                return next(createError(NOT_FOUND, "user Not Found"))
            
            if (!user.accessToken)
                return next(createError(UNAUTHORIZED, 'you are not authenticated'))
            
            req.user = {
                _id: user._id, firstname: user.firstname,
                lastname: user.lastname, email: user.email
            }

            next()
            
        } catch (error) {
            return next(createError(UNAUTHORIZED, 'invalid access token'))
        }
        
    } catch (error) {
        next(error)
    }

}