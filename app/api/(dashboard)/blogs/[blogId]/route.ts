import connect from "@/lib/db";
import Blog from "@/lib/models/blog";
import Category from "@/lib/models/category";
import User from "@/lib/models/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export const GET = async (
	req: Request,
	{
		params,
	}: {
		params: {
			blogId: string;
		};
	}
) => {
	try {
		const { searchParams } = new URL(req.url);
		const userId = searchParams.get("userId");
		const categoryId = searchParams.get("categoryId");
		const blogId = params.blogId;

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

		if (!blogId || !Types.ObjectId.isValid(blogId)) {
			return new NextResponse("No Blog ID found!", {
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

		const blog = await Blog.findOne({
			_id: blogId,
			user: userId,
			category: categoryId,
		});
		if (!blog) {
			return new NextResponse("Blog not found in the DB!", {
				status: 400,
			});
		}

		return new NextResponse(
			JSON.stringify({
				blog,
			}),
			{
				status: 200,
			}
		);
	} catch (error: // eslint-disable-next-line
	any) {
		return new NextResponse("Error in fetching blog" + error.message, {
			status: 500,
		});
	}
};

export const PATCH = async (
	req: Request,
	{
		params,
	}: {
		params: {
			blogId: string;
		};
	}
) => {
	try {
		const { searchParams } = new URL(req.url);
		const userId = searchParams.get("userId");
		const categoryId = searchParams.get("categoryId");
		const blogId = params.blogId;
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

		if (!blogId || !Types.ObjectId.isValid(blogId)) {
			return new NextResponse("No Blog ID found!", {
				status: 400,
			});
		}

		if (!title || !description) {
			return new NextResponse("Please input required fields!", {
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

		const blog = await Blog.findOne({
			_id: blogId,
			user: userId,
			category: categoryId,
		});
		if (!blog) {
			return new NextResponse("Blog not found in the DB!", {
				status: 400,
			});
		}

		const updatedBlog = await Blog.findByIdAndUpdate(
			blogId,
			{ title, description },
			{ new: true }
		);

		if (!updatedBlog) {
			return new NextResponse(
				"Something went wrong, please try again to update the blog",
				{
					status: 400,
				}
			);
		}

		return new NextResponse(
			JSON.stringify({
				message: "Successful Updating the Blog!",
				updatedBlog,
			}),
			{
				status: 200,
			}
		);
	} catch (error: // eslint-disable-next-line
	any) {
		return new NextResponse("Error in updating blog" + error.message, {
			status: 500,
		});
	}
};

export const DELETE = async (
	req: Request,
	{
		params,
	}: {
		params: {
			blogId: string;
		};
	}
) => {
	try {
		const { searchParams } = new URL(req.url);
		const userId = searchParams.get("userId");
		const blogId = params.blogId;

		if (!userId || !Types.ObjectId.isValid(userId)) {
			return new NextResponse("No User ID found!", {
				status: 400,
			});
		}

		if (!blogId || !Types.ObjectId.isValid(blogId)) {
			return new NextResponse("No Blog ID found!", {
				status: 400,
			});
		}

		await connect();

		const deletedBlog = await Blog.findByIdAndDelete(blogId);

		return new NextResponse(
			JSON.stringify({
				message: "Deleted a Blog Successfully",
				deletedBlog,
			}),
			{
				status: 200,
			}
		);
	} catch (error: // eslint-disable-next-line
	any) {
		return new NextResponse("Error in deleting a blog" + error.message, {
			status: 500,
		});
	}
};
