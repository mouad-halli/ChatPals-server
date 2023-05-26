import { ObjectId } from 'mongoose'
import User from '../models/user'

export const findUser = async (userId: string) => {

    return await User.findById(userId)

}
