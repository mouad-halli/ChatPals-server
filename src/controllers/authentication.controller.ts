import { NextFunction, Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import User from '../models/user'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { createError } from "../utils/error"
import {
    ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, 
    ACCESS_TOKEN_EXPIRATION, REFRESH_TOKEN_EXPIRATION, CLIENT_URL
} from '../config/environment'

const { OK, CREATED, BAD_REQUEST, UNAUTHORIZED, PERMANENT_REDIRECT } = StatusCodes

const register = async (req: Request, res: Response, next: NextFunction) => {
    try {

        if (await User.findOne({ email: req.body.email })) {
            return next(createError(BAD_REQUEST, "this email is already in use"))
        }

        const salt = await bcryptjs.genSalt(10)
        const hash = await bcryptjs.hash(req.body.password, salt)

        await new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: hash
        }).save()

        res.status(CREATED).json('registered successfully')
        
    } catch (error) {
        next(error)
    }
}

const login = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const user = await User.findOne({email: req.body.email}).select("+password")

        if (!user)
            return next(createError(BAD_REQUEST, "Wrong email or password"))

        const isPasswordCorrect = await bcryptjs.compare(req.body.password, user.password)

        if (isPasswordCorrect === false)
            return next(createError(BAD_REQUEST, "Wrong email or password"))

        const generatedRefreshToken = jwt.sign(
            { _id: user._id }, REFRESH_TOKEN_SECRET,
            { expiresIn: REFRESH_TOKEN_EXPIRATION }
        )

        const generatedAccessToken = jwt.sign(
            { _id: user._id }, ACCESS_TOKEN_SECRET,
            { expiresIn: ACCESS_TOKEN_EXPIRATION }
        )

        await User.findByIdAndUpdate(user._id, {
            refreshToken: generatedRefreshToken,
            accessToken: generatedAccessToken
        })

        res.status(OK)
        .cookie('refreshToken', generatedRefreshToken, { httpOnly: true })
        .cookie('accessToken', generatedAccessToken, { httpOnly: true })
        .json({ firstname: user.firstname, lastname: user.lastname, email: user.email, imgUrl: user.imgUrl })

    } catch (error) {
        next(error)
    }
}

const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        await User.findOneAndUpdate({ _id: req.user._id }, {
            accessToken: null, refreshToken: null
        })

        res.clearCookie('accessToken').clearCookie('refreshToken').status(OK).json('logged out successfully')

    } catch (error) {
        next(error)
    }
}

const refreshAccessToken = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const accessToken = req.cookies.accessToken

        const { exp } = jwt.decode(accessToken) as jwt.JwtPayload

        if (!await User.findOne({_id: req.user._id, accessToken: accessToken}) || !exp || exp * 1000 > Date.now()) {
            await User.findOneAndUpdate({ _id: req.user._id }, {
                accessToken: null, refreshToken: null
            })
            return next(createError(UNAUTHORIZED, 'you are not authorized to do this action'))
        }

        const generatedAccessToken = jwt.sign(
            { _id: req.user._id }, ACCESS_TOKEN_SECRET,
            { expiresIn: ACCESS_TOKEN_EXPIRATION }
        )

        const user = await User.findByIdAndUpdate(req.user._id, {
            accessToken: generatedAccessToken
        })

        res.status(OK)
        .cookie('accessToken', generatedAccessToken, { httpOnly: true })
        .json(user)
        
    } catch (error) {
        next(error)
    }
}

const googleAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {

        if (!req.user)
            next()

        const generatedRefreshToken = jwt.sign(
            { _id: req.user._id }, REFRESH_TOKEN_SECRET,
            { expiresIn: REFRESH_TOKEN_EXPIRATION }
        )

        const generatedAccessToken = jwt.sign(
            { _id: req.user._id }, ACCESS_TOKEN_SECRET,
            { expiresIn: ACCESS_TOKEN_EXPIRATION }
        )

        await User.findByIdAndUpdate(req.user._id, {
            refreshToken: generatedRefreshToken,
            accessToken: generatedAccessToken
        })

        res.status(OK)
        .cookie('refreshToken', generatedRefreshToken, { httpOnly: true })
        .cookie('accessToken', generatedAccessToken, { httpOnly: true })
        .redirect(PERMANENT_REDIRECT, CLIENT_URL + '/settings')

    } catch (error) {
        next(error)
    }
}


export = {
    register, login, logout, refreshAccessToken, googleAuth
}