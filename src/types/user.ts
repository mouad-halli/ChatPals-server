import { Request } from "express"
import { Types } from "mongoose"

export interface IUser {
    _id: Types.ObjectId
    firstname: string
    lastname: string
    email: string
    password: string
    accessToken?: string
    refreshToken?: string
}

export interface UserDto extends Omit<IUser, '_id' | 'accessToken' | 'refreshToken'> {}

export interface Usertype extends Omit<IUser, 'password' | 'accessToken' | 'refreshToken'> {}

export interface UpdateUserDto extends Partial<UserDto> {}