import { Schema, model } from "mongoose";
import { IRelationship, RelationShipState } from "../types/relationship";

const relationshipSchema = new Schema<IRelationship>({
    
    requester: { type: Schema.Types.ObjectId, ref: 'User' },

    recipient: { type: Schema.Types.ObjectId, ref: 'User' },

    state: { type: String, enum: RelationShipState, default: RelationShipState.PENDING }

})

export default model<IRelationship>('Relationship', relationshipSchema)