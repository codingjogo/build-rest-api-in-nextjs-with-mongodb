import connect from "@/lib/db";
import Blog from "@/lib/models/blog";
import Category from "@/lib/models/category";
import User from "@/lib/models/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
	try {
		const { searchParams } = new URL(req.url);
		const userId = searchParams.get("userId");
		const categoryId = searchParams.get("categoryId");

		if (!userId || !Types.ObjectId.isValid(userId)) {
			return new NextResponse("No User ID found!", {
				status: 400,
			});
		}

		if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
			return new NextResponse("No Category ID found!", {
				status: 400,
			});
		}

		await connect();

		const user = await User.findById(userId);
		if (!user) {
			return new NextResponse("User not found in the DB!", {
				status: 400,
			});
		}

		const category = await Category.findById(categoryId);
		if (!category) {
			return new NextResponse("Category not found in the DB!", {
				status: 400,
			});
		}

    // TODO
		// eslint-disable-next-line
		const filter: any = {
			user: userId,
			category: categoryId,
		};

		const blogs = await Blog.find(filter);

		return new NextResponse(
			JSON.stringify({
				blogs,
			}),
			{
				status: 200,
			}
		);
	} catch (error: // eslint-disable-next-line
	any) {
		return new NextResponse("Error in fetching blogs" + error.message, {
			status: 500,
		});
	}
};

export const POST = async (req: Request) => {
	try {
		const { searchParams } = new URL(req.url);
		const userId = searchParams.get("userId");
		const categoryId = searchParams.get("categoryId");
		const { title, description } = await req.json();

		if (!userId || !Types.ObjectId.isValid(userId)) {
			return new NextResponse("No User ID found!", {
				status: 400,
			});
		}

		if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
			return new NextResponse("No Category ID found!", {
				status: 400,
			});
		}

		await connect();

		const user = await User.findById(userId);
		if (!user) {
			return new NextResponse("User not found in the DB!", {
				status: 400,
			});
		}

		const category = await Category.findById(categoryId);
		if (!category) {
			return new NextResponse("Category not found in the DB!", {
				status: 400,
			});
		}

		const newBlog = new Blog({
			title,
			description,
			user: new Types.ObjectId(userId),
			category: new Types.ObjectId(categoryId),
		});
		await newBlog.save();

		return new NextResponse(
			JSON.stringify({
				message: "Success Creating a Blog",
				newBlog,
			}),
			{
				status: 200,
			}
		);
	} catch (error: // eslint-disable-next-line
	any) {
		return new NextResponse("Error in creating a blog" + error.message, {
			status: 500,
		});
	}
};
