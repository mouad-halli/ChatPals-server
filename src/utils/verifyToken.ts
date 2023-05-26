import jwt from 'jsonwebtoken'
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../config/environment"
import { tokenPayload } from '../types/token'
import User from '../models/user'
import { createError } from './error'
import { StatusCodes } from 'http-status-codes'

const { UNAUTHORIZED, NOT_FOUND, FORBIDDEN } = StatusCodes

export const verifyToken = async (token: string | undefined, tokenType: string) => {

    if (!token)
        throw createError(FORBIDDEN, 'you are not authenticated')

    const tokenSecret = tokenType === 'accessToken' ? ACCESS_TOKEN_SECRET : REFRESH_TOKEN_SECRET

    let userId

    try {
        const payload = jwt.verify(token, tokenSecret) as tokenPayload
        userId = payload._id
        
    } catch (error) {
        throw createError(UNAUTHORIZED, "invalid token")
    }
    const user = await User.findById(userId).select("+accessToken")

    if (!user)
        throw createError(NOT_FOUND, "user Not Found")
        
    if (!user.accessToken)
        throw createError(FORBIDDEN, 'you are not authenticated')
    
    return {
        _id: user._id, firstname: user.firstname,
        lastname: user.lastname, email: user.email,
        imgUrl: user.imgUrl
    }
}