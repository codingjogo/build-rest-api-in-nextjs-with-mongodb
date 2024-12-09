import connect from "@/lib/db";
import WhatIf from "@/lib/models/what-if";
import { NextResponse } from "next/server";

export const GET = async () => {
	try {
    await connect();
		const whatIfs = await WhatIf.find();
		return new NextResponse(JSON.stringify(whatIfs), { status: 200 });
	} catch (error: // eslint-disable-next-line
	any) {
		return new NextResponse("Error in fetching whatIfs" + error.message, {
			status: 500,
		});
	}
};
