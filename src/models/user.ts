import { Schema, model } from "mongoose";
import { IUser } from "../types/user";

const UserSchema = new Schema<IUser>({

    firstname: { type: String },

    lastname: { type: String },

    email: { type: String },

    imgUrl: { type: String, default: null },
    
    password: { type: String, select: false },

    accessToken: { type: String, select: false },

    refreshToken: { type: String, select: false },

    googleId: { type: String, select: false }

} )

export default model<IUser>('User', UserSchema)