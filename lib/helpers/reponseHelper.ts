

export class ResponseHelper {

    static sendSuccessResponse(status: number = 200, message: string = "", data: any = []) {

        let responseBody: any = {
            success: true,
            message,
            status: status,
            data
        }

        return Response.json(responseBody);

    }

    static sendErrorResponse(status: number, message: string = "", data: any = [], errors = {}) {

        let responseBody: any = {
            success: false,
            message,
            errors,
            status: status,
            data
        };

        return Response.json(responseBody);

    }

}