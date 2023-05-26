import { ObjectId } from "mongoose";
import { IChannel } from "./channel";
import { IUser } from "./user";

export interface IMessage {
    id?: ObjectId
    author: IUser,
    channel: IChannel,
    content: string,
    seen: boolean
}