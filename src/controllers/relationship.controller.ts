import { NextFunction, Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { findReceivedFriendRequstsUsers, findUserFriends, findUserStrangers } from "../services/relationship.service"

const { OK } = StatusCodes

const getStrangers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const strangers = await findUserStrangers(String(req.user._id))
        res.status(OK).json(strangers)
    } catch (error) {
        next(error)
    }
}

const getFriends = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const friends = await findUserFriends(String(req.user._id))
        res.status(OK).json(friends)
    } catch (error) {
        next(error)
    }
}

const getReceivedFriendRequstsUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const requesters = await findReceivedFriendRequstsUsers(String(req.user._id))

        res.status(OK).json(requesters)
    } catch (error) {
        next(error)
    }
}

export = {
    getStrangers, getFriends, getReceivedFriendRequstsUsers
}