import { NextFunction, Request, Response } from "express"
import Channel from '../models/channel'
import { StatusCodes } from "http-status-codes"
import { createError } from "../utils/error"
import { isValidObjectId } from "mongoose"
import { findRelationship } from "../services/relationship.service"
import { RelationShipState } from "../types/relationship"

const { OK, BAD_REQUEST } = StatusCodes

const getUserChannels = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const channels = (await Channel.find({ participants: { _id: req.user._id } })
            .populate('participants')
            .populate({ path: 'messages', perDocumentLimit: 1, select: '-_id -channel content', options: { sort: { 'createdAt': -1 } }, populate: 'author' }))
            .map(channel => {

            const {_id, participants, messages } = channel

            const friend = participants.find(participant => String(participant._id) !== String(req.user._id))

            let lastMessage = null

                if (messages[0])
                    lastMessage = { channelId: _id, author: messages[0].author, content: messages[0].content }

            return { _id, friend, lastMessage }
        })
        res.status(OK).json(channels)
    } catch (error) {
        next(error)
    }
}

const getChannel = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const channel_id = req.params.channel_id

        if (!channel_id || !isValidObjectId(channel_id))
            return next(createError(BAD_REQUEST, 'invalid channel id'))

        const channel = await Channel.findById(channel_id).populate('participants')

        if (!channel)
            return next(createError(BAD_REQUEST, 'channel not found'))

        const friend = channel.participants.find(participant => String(participant._id) !== String(req.user._id))

        let isLocked = false

        if (friend && (await findRelationship(String(req.user._id), String(friend._id)))?.state !== RelationShipState.FRIENDS)
            isLocked = true

        res.status(OK).json({
            _id: channel._id,
            friend,
            imgUrl: friend?.imgUrl,
            isLocked
        })
    } catch (error) {
        next(error)
    }
}

export = {
    getUserChannels,
    getChannel
}