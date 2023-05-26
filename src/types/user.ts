import { ObjectId } from "mongoose"

export interface IUser {
    _id: ObjectId
    firstname: string
    lastname: string
    email: string
    password: string
    imgUrl?: string
    accessToken?: string
    refreshToken?: string
    googleId?: string
}

export interface UserDto extends Omit<IUser, '_id' | 'accessToken' | 'refreshToken'> {}

export interface Usertype extends Omit<IUser, 'password' | 'accessToken' | 'refreshToken'> {}

export interface UpdateUserDto extends Partial<UserDto> {}