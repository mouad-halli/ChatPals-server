import { ObjectId } from 'mongoose'
import Relationship from '../models/relationship'
import User from '../models/user'
import { RelationShipState } from '../types/relationship'
import { IUser } from '../types/user'

type userIdType = string | ObjectId

export const createRelationship = async (requesterId: string, recipientId: string, relationship: RelationShipState) => {

    return await new Relationship({
        requester: requesterId,
        recipient: recipientId,
        state: relationship
    }).save()

}

export const updateRelationship = async (requester: IUser, recipient: IUser, relationship: RelationShipState) => {

    return await Relationship.findOneAndUpdate(
        { requester: requester, recipient: recipient },
        { $set: { state: relationship } },
        { new: true}
    )

}


export const findRelationship = async (myId: string, userId: string) => {

    return await Relationship.findOne({$or: [{requester: myId, recipient: userId}, {requester: userId, recipient: myId}]}).populate('requester').populate('recipient')

}

export const findUserFriends = async (userId: string) => {

    const friendships =  await Relationship.find(
        { $or: [{requester: userId}, {recipient: userId}], state: RelationShipState.FRIENDS }
    ).populate("requester recipient", "firstname lastname imgUrl")

    return friendships.map(friendship => {

        const {requester, recipient} = friendship

        if (String(requester._id) !== userId)
            return requester
        else
            return recipient
    })

}

export const findUsersWithBlockedRelationship = async (user: IUser) => {

    const friendships =  await Relationship.find({$or: [{requester: user}, {recipient: user}], state: RelationShipState.BLOCKED})

    return friendships.map(friendship => {

        const {requester, recipient} = friendship

        if (requester._id === user._id)
            return recipient
        else
            return requester
    })
}

export const findUserStrangers = async (userId: string) => {

    const users = await User.find({_id: { $ne: userId }}).lean()

    let result = []

    for (let i = 0; i < users.length; i++) {

        let relationship = 'stranger'
        const usersRelationship = await findRelationship(userId, String(users[i]._id))

        if (usersRelationship && (usersRelationship.state === "friends" || // if friends
        ((usersRelationship.state === 'pending' || usersRelationship.state === 'blocked') // or sent me a request or blocking me
            && String(usersRelationship.recipient._id) === userId )
        ))
            continue

        if (usersRelationship) {

            const { requester, state } = usersRelationship

            if (state === RelationShipState.PENDING && String(requester._id) === userId)
                relationship = "sent"
            else if (state === RelationShipState.BLOCKED && String(requester._id) === userId)
                relationship = 'blocked'
        }

        result.push({...users[i], relationship})
    }

    return result

}

export const findReceivedFriendRequstsUsers = async (userId: string) => {

    return (await Relationship.find({ recipient: userId, state: RelationShipState.PENDING }).populate('requester')).map(relationship => relationship.requester)
}