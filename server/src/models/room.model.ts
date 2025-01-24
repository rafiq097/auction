import mongoose, { Schema, Document } from "mongoose";

export interface IRoom extends Document {
  name: string;
  owner: string;
  participants: string[];
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
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.model<IRoom>("Room", roomSchema);

export default Room;
