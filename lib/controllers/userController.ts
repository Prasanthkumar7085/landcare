import { SOMETHING_WENT_WRONG, USER_CREATED } from "../constants/appMessages";
import { ResponseHelper } from "../helpers/reponseHelper";
import { UserDataServiceProvider } from "../services/userDataServiceProvider";

const userDataServiceProvider = new UserDataServiceProvider();





export class UserController {

    async signUp(req: any) {
        try {

            const reqData = await req.json();

            const reponseData :any = await userDataServiceProvider.create(reqData);
            delete reponseData[0].password

            return ResponseHelper.sendSuccessResponse(200, USER_CREATED, reponseData[0]);


        } catch (error:any) {
            console.log(error);
            return ResponseHelper.sendErrorResponse(500, SOMETHING_WENT_WRONG,[], error);
        }
    }

}