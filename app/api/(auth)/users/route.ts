import connect from "@/lib/db";
import User from "@/lib/models/user";
import { ObjectId } from "mongodb";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export const GET = async () => {
	try {
    await connect();
		const users = await User.find();
		return new NextResponse(JSON.stringify(users), { status: 200 });
	} catch (error: // eslint-disable-next-line
	any) {
		return new NextResponse("Error in fetching users" + error.message, {
			status: 500,
		});
	}
};

export const POST = async (req: Request) => {
	try {
		const body = await req.json();
		await connect();
		const newUser = new User(body)
		await newUser.save();
		return new NextResponse(JSON.stringify({message: 'User Created Successfully', newUser}), { status: 200 });
	} catch (error: // eslint-disable-next-line
	any) {
		return new NextResponse("Error in posting a user" + error.message, {
			status: 500,
		});
	}
}

export const PATCH = async (req: Request) => {
	try {
		const body = await req.json();

		const {userId, newName, newEmail, newPassword} = body;

		await connect();

		if (!userId || !newName || !newEmail || !newPassword) {
			return new NextResponse("Occured when updating a user, Check input required fields", {
				status: 400,
			});
		}

		if (!Types.ObjectId.isValid(userId)) {
			return new NextResponse("Occured when updating a user, Invalid User ID", {
				status: 400,
			});
		}

		const updatedUser = await User.findByIdAndUpdate(
			{ _id: new ObjectId(userId) },
			{ name: newName, email: newEmail, password: newPassword },
			{ new: true }
		)

		if (!updatedUser) {
			return new NextResponse("User not found in the DB", updatedUser), { status: 400 };
		}

		return new NextResponse(JSON.stringify({message: 'User Updated  Successfully', updatedUser}), { status: 200 });
	} catch (error: // eslint-disable-next-line
	any) {
		return new NextResponse("Error in updating a user" + error.message, {
			status: 500,
		});
	}
}

export const DELETE = async (req: Request) => {
	try {
		const { searchParams } = new URL(req.url);
		const userId = searchParams.get('id')

		if (!userId) {
			return new NextResponse("User ID not found!", {
				status: 400,
			});
		}

		if (!Types.ObjectId.isValid(userId)) {
			return new NextResponse("Invalid User ID!", {
				status: 400,
			});
		}

		await connect();

		const deletedUser = await User.findByIdAndDelete(
			new Types.ObjectId(userId)
		)

		if (!deletedUser) {
			return new NextResponse("User not found in the DB!", {
				status: 400,
			});
		}

		return new NextResponse(JSON.stringify({message: 'User Deleted Successfully', deletedUser}), { status: 200 });
	} catch (error: // eslint-disable-next-line
		any) {
			return new NextResponse("Error in deleting a user" + error.message, {
				status: 500,
			});
		}
}