import { NextRequest, NextResponse } from "next/server";
import { UserController } from "../../../../../../lib/controllers/userController";
import { validate } from "../../../../../../lib/middlewares/validationMiddlware";
import { SignInSchema } from "../../../../../../lib/validations/users/signin";
import { ResponseHelper } from "../../../../../../lib/helpers/reponseHelper";
const userController = new UserController();

    export async function POST(req: NextRequest, res: NextResponse) {
        // Validate request
        const reqData = await req.json();
        const validationErrors = await validate(SignInSchema, reqData);
        if (validationErrors) {
            return ResponseHelper.sendValidationErrorResponse(422, 'Validation Error', validationErrors);
        }

        return userController.signIn(reqData, res);
    }