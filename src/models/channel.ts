import { Schema, model } from "mongoose";
import { IChannel } from "../types/channel";

const ChannelSchema = new Schema<IChannel>({

    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],

    // messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }]
    
})

ChannelSchema.virtual("messages", {
    ref: 'Message',
    localField: '_id',
    foreignField: 'channel'
})


export default model<IChannel>('Channel', ChannelSchema)