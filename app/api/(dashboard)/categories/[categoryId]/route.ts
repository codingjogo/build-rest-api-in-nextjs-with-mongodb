/*
** Creating Dynamic Routes ** :
PATCH category by user id with params /dashboard/categories/[categoryId]/edit/page.tsx
DELETE by Category ID with params /dashboard/categories/[categoryId]
/dashboard/categories/[categoryId]?userId=123123
*/

import Category from "@/lib/models/category";
import User from "@/lib/models/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request, {params} : {
  params: {
    categoryId: string;
  }
}) => {
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

    const categoryId = params.categoryId; // to update categodyId from dynamic route [categoryId]

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        "Category ID Not Found or Invalid ID!",
        {
          status: 400,
        }
      );
    }

    const {title} = await req.json();

    if (!title) {
      return new NextResponse(
        "Invalid input or must input required fields!",
        {
          status: 400,
        }
      );
    }

    const user = await User.findById(userId);

    if (!user || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        "User Not Found in the DB or Invalid ID!",
        {
          status: 400,
        }
      );
    }

    const category = await Category.findOne({
      _id: categoryId,
      user: userId
    })

    if (!category || !Types.ObjectId.isValid(category)) {
      return new NextResponse(
        "Category Not Found in the DB or Invalid ID!",
        {
          status: 400,
        }
      );
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { title },
      {new: true}
    )

    return new NextResponse(
      JSON.stringify({
        message: "Successful Updating a Category by User ID",
        updatedCategory
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