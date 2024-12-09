import { model, models, Schema } from "mongoose";

const UserSchema = new Schema(
	{
		name: { type: "string", required: true },
		email: { type: "string", required: true, unique: true },
		password: { type: "string", required: true },
	},
	{
		timestamps: true,
	}
);

const User = models.User || model("User", UserSchema);

export default User;  
