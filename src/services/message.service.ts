import Message from '../models/message'
import { ObjectId } from "mongoose"

export const createMessage = async (authorId: string, channelId: string, MsgContent: string) => {

    return await new Message({
        author: authorId,
        channel: channelId,
        content: MsgContent
    }).save()
    
}