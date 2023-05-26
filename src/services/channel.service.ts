import Channel from "../models/channel"
import { IUser } from "../types/user";

export const createChannel = async (ChannelParticipants: IUser[]) => {

    return new Channel({
        participants: ChannelParticipants
    }).save()

}