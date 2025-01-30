import mongoose, { Schema, Document } from "mongoose";

export interface IRoom extends Document {
  name: string;
  owner: string;
  participants: any[];
  curr: number;
  teams: any[];
}

const roomSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Room name is required"],
      unique: true,
    },
    owner: {
      type: String,
      required: true,
    },
    participants: {
      type: [Schema.Types.Mixed],
      default: [],
    },
    curr: {
      type: Number,
      default: 0,
    },
    teams: {
      type: [Schema.Types.Mixed],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.model<IRoom>("Room", roomSchema);

export default Room;
