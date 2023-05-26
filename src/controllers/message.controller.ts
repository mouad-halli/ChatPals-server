import { NextFunction, Request, Response } from "express"
import { createError } from "../utils/error"
import { StatusCodes } from "http-status-codes"
import { isValidObjectId } from "mongoose"
import Message from '../models/message'

const { BAD_REQUEST, OK } = StatusCodes

const getChannelMessages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const channelId = req.params.channel_id

        if (!channelId|| !isValidObjectId(channelId) )
            next(createError(BAD_REQUEST, 'invalid channle id'))

        const messages = await Message.find({channel: channelId}).select('-_id -seen').populate('author')

        res.status(OK).json(messages)
        
    } catch (error) {
        next(error)
    }
}

export = {
    getChannelMessages
}