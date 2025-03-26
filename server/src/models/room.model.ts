import mongoose, { Schema, Document } from "mongoose";

export interface IRoom extends Document {
  name: string;
  owner: string;
  participants: any[];
  curr: number;
  pause: boolean;
  teams: any[];
  currentBid: any;
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
    pause: {
      type: Boolean,
      default: false,
    },
    teams: [{
      name: String,
      spent: Number,
      remaining: Number,
      players: [{ type: mongoose.Schema.Types.Mixed }],
      allr: Number,
      batters: Number,
      bowlers: Number,
      wks: Number,
      overseas: Number,
    }],
    currentBid: {
      price: Number,
      team: String,
      time: Number,
    }
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.model<IRoom>("Room", roomSchema);

export default Room;
