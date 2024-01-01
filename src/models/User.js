import bcrpt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  socialOnly: { type: Boolean, default: false },
  avatarUrl: String,
  username: { type: String, required: true, unique: true },
  password: String,
  name: { type: String, required: true },
  location: String,
});

userSchema.pre("save", async function () {
  if (this.password) {
    this.password = await bcrpt.hash(this.password, 5);
  }
});

const User = mongoose.model("User", userSchema);

export default User;
