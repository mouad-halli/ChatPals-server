import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { verifyToken } from "./utils/verifyToken";
import { extractCookieFromCookies } from "./utils/cookies";
import { findUser } from "./services/user.service";
import { createRelationship, findRelationship } from "./services/relationship.service";
import { RelationShipState } from "./types/relationship";
import Relationship from './models/relationship'
import { Usertype } from "./types/user";
import { createChannel } from "./services/channel.service";
import Channel from './models/channel'
import { createMessage } from "./services/message.service";

const usersSockets = new Map<string, string[]>()

const socketServer = (io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {

    io.on('connection', async (socket: Socket) => {
        let socketUser: Usertype

        const accessToken = extractCookieFromCookies(socket.handshake.headers.cookie, "accessToken")

        if (!accessToken)
            return

        try {
            socketUser = await verifyToken(accessToken, "accessToken")

            const userId = String(socketUser._id)

            socket.join(userId)

            const channels = await Channel.find({ participants: { _id: userId } }).select('_id')

            channels.forEach(({_id}) => socket.join(String(_id)))

            const userSockets = usersSockets.get(userId)

            if (userSockets)
                usersSockets.set(userId, [...userSockets, socket.id])
            else 
                usersSockets.set(userId, [socket.id])

        } catch (error) {
            // console.log(error)
            return
        }

        socket.on('disconnect', async () => {
            const userId = String(socketUser._id)

            const userSockets = usersSockets.get(userId)

            if (!userSockets)
                return

            const index = userSockets.indexOf(socket.id)

            if (index > -1) {
                userSockets.splice(index, 1)
                usersSockets.set(userId, userSockets)
            }
        })

        socket.on('send-friend-request', async (targetId: string, callback) => {

            const target = await findUser(targetId)

            if (!target)
                return callback(false)

            let relationship = await findRelationship(String(socketUser._id), targetId)

            if (relationship)
                return callback(false)

            if (!await createRelationship(String(socketUser._id), targetId, RelationShipState.PENDING))
                return callback(false)

            socket.to(targetId).emit('receive-friend-request', socketUser)
            
            return callback(true)
        })

        socket.on('cancel-friend-request', async (userId: string, callback) => {

            const relationship = await findRelationship(String(socketUser._id), userId)

            if (!relationship || relationship.state !== RelationShipState.PENDING || String(relationship.requester._id) !== String(socketUser._id))
                return callback(false)

            await Relationship.findOneAndRemove({_id: relationship._id})

            socket.to(userId).emit('canceled-friend-request', socketUser)

            callback(true)
        })

        socket.on('decline-friend-request', async (userId: string, callback) => {

            const relationship = await findRelationship(String(socketUser._id), userId)

            if (!relationship || relationship.state !== RelationShipState.PENDING || String(relationship.recipient._id) !== String(socketUser._id))
                return callback(false)

            await Relationship.findOneAndRemove({_id: relationship._id})

            socket.to(userId).emit('declined-friend-request', socketUser)

            callback(true)
        })

        socket.on('accept-friend-request', async (userId: string, callback) => {

            let relationship = await findRelationship(String(socketUser._id), userId)

            if (!relationship || relationship.state !== RelationShipState.PENDING || String(relationship.recipient._id) !== String(socketUser._id))
                return callback(false)

            relationship =  await Relationship.findOneAndUpdate({_id: relationship._id }, { state: RelationShipState.FRIENDS }, { new: true }).populate('recipient').populate('requester')

            if (!relationship)
                return callback(false)
                
            let channel = await Channel.findOne({participants: { $all: [relationship.recipient._id, relationship.requester._id] }})

            if (!channel) {
                channel = await createChannel([relationship.requester, relationship.recipient])
                io.to(String(relationship.requester._id)).emit('add-channel', { _id: channel._id, friend: relationship.recipient })
                io.to(String(relationship.recipient._id)).emit('add-channel', { _id: channel._id, friend: relationship.requester })
                io.to([String(relationship.requester._id), String(relationship.recipient._id)]).socketsJoin(String(channel._id))
            } else
                io.to(String(channel._id)).emit('unlock-channel', channel._id)

            io.to(String(relationship.requester._id)).emit('accepted-friend-request', socketUser)

            callback(true)
        })

        socket.on('unfriend-user', async (targetId: string, callback) => {

            if (!await findUser(targetId))
                return callback(false)

            const channel = await Channel.findOne({ participants: { $all: [socketUser._id, targetId] } }).select('_id')
            const relationship = await findRelationship(String(socketUser._id), targetId)

            if (!channel || !relationship || relationship.state !== RelationShipState.FRIENDS)
                return callback(false)

            await Relationship.findOneAndRemove({_id: relationship._id})

            socket.to(targetId).emit('unfriend-user', socketUser)

            io.to(String(channel._id)).emit('lock-channel', channel._id)

            callback(true)
        })

        socket.on('send-message', async (channelId: string, messageContent: string) => {
            const channel = await Channel.findById(channelId).select('_id participants')

            if (!channel)
                return

            const targetId = channel.participants.find(participant => String(participant._id) !== String(socketUser._id) )

            if (!await findRelationship(String(socketUser._id), String(targetId)))
                return

            const message = await createMessage(String(socketUser._id), channelId, messageContent)

            if (!message)
                return

            io.to(channelId).emit('receive-message', {channelId: channelId, author: socketUser, content: message.content})
        })

        socket.on('connection-status', (userId: string, callback) => {
            let status = usersSockets.get(userId)?.length ? 'Online' : 'Offline'
            callback(status)
        })
    })
}

export default socketServer