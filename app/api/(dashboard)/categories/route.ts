/*
GET, returns all categories by user id
POST, create new category by UserID
*/


import connect from "@/lib/db";
import Category from "@/lib/models/category";
import User from "@/lib/models/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
	try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        "User Not Found!",
        {
          status: 400,
        }
      );
    }

    await connect();

    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse(
        "User Not Found in the DB!",
        {
          status: 400,
        }
      );
    }

    const categories = await Category.find({
      user: new Types.ObjectId(userId),
    })

    return new NextResponse(
			JSON.stringify(categories),
			{
				status: 200,
			}
		);
	} catch (error: // eslint-disable-next-line
	any) {
		return new NextResponse(
			"Error in fetching categories" + error.message,
			{
				status: 500,
			}
		);
	}
};


export const POST = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    const {title} = await req.json();

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        "User Not Found!",
        {
          status: 400,
        }
      );
    }

    await connect();

    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse(
        "User Not Found in the DB!",
        {
          status: 400,
        }
      );
    }

    const newCategory = new Category({
      title,
      user: new Types.ObjectId(userId)
    })

    await newCategory.save();

    return new NextResponse(
			JSON.stringify({
        message: 'Successful Creating a Category',
        newCategory
      }),
			{
				status: 200,
			}
		);
  } catch (error: // eslint-disable-next-line
    any) {
      return new NextResponse(
        "Error in updating a category" + error.message,
        {
          status: 500,
        }
      );
    }
}