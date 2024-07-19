import { UserController } from "../../../../../lib/controllers/userController";
const userController = new UserController();

export async function POST(req: Request) {
    return userController.signUp(req);
}