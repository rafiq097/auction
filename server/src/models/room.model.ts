import mongoose, { Schema, Document } from "mongoose";

const broSchema: Schema = new Schema({
  name: { type: String, required: true },
  team: { type: String, required: true },
});

interface IBro {
  name: string;
  team: string;
}

export interface IRoom extends Document {
  name: string;
  owner: string;
  participants: IBro[];
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
      type: [broSchema],
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
