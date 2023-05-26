import { ObjectId } from "mongoose";
import { IUser } from "./user";
import { IMessage } from "./message";

export interface IChannel {

    _id: ObjectId,

    participants: IUser[]

    messages: IMessage[]

}