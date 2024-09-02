import { NextRequest, NextResponse } from "next/server";
import { UserController } from "../../../../../../lib/controllers/userController";
const userController = new UserController();

export async function POST(req:NextRequest, res: NextResponse) {
    return userController.signUp(req,res);
}