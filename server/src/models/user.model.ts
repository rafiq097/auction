import mongoose, { Schema, Document } from "mongoose";

const toIST = (date: Date): Date => {
  const IST = 5.5 * 60 * 60 * 1000;
  return new Date(date.getTime() + IST);
};

export interface IUser extends Document {
  id?: string;
  name: string;
  email: string;
  time: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema: Schema = new Schema(
  {
    id: {
      type: String,
    },
    name: {
      type: String,
      required: [true, "Enter Name"],
    },
    email: {
      type: String,
      required: [true, "Enter Email"],
      unique: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please enter a valid email address",
      ],
    },
    time: {
      type: Date,
      default: toIST(new Date()),
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next: any) {
  if (this.isNew) {
    this.createdAt = toIST(this.createdAt as Date);
    this.time = toIST(this.time as Date);
  }
  this.updatedAt = toIST(new Date());
  next();
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
