import { IUser } from "./user";

export enum RelationShipState {
    PENDING = "pending",
    FRIENDS = "friends",
    BLOCKED = "blocked"
}

export interface IRelationship {
    requester: IUser,
    recipient: IUser,
    state: string
}