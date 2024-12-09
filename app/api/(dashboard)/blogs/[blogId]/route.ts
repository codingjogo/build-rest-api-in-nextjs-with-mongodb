import connect from "@/lib/db";
import Blog from "@/lib/models/blog";
import Category from "@/lib/models/category";
import User from "@/lib/models/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export const GET = async (req: Request, {params} : {
  params: {
    blogId: string;
  }
}) => {
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

		const blog = await Blog.findOne(
      {
        _id: blogId,
        user: userId,
        category: categoryId
      }
    );
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
		return new NextResponse("Error in fetching blogs" + error.message, {
			status: 500,
		});
	}
};