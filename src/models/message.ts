import { Schema, model, ObjectId } from "mongoose";
import { IMessage } from "../types/message";

const messageSchema = new Schema<IMessage>({

    author: { type: Schema.Types.ObjectId, ref: 'User' },

    channel: { type: Schema.Types.ObjectId, ref: 'Channel' },

    content: String,

    seen: { type: Boolean, default: false }

}, { timestamps: true })

export default model<IMessage>('Message', messageSchema)