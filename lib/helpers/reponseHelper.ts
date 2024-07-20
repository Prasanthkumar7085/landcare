import { NextResponse } from "next/server";


export class ResponseHelper {

    static sendSuccessResponse(status: number = 200, message: string = "", data: any = []) {

        let responseBody: any = {
            success: true,
            message,
            status: status,
            data
        }

       return NextResponse.json(responseBody, { status: status });

    }

    static sendErrorResponse(status: number, message: string = "",errors = {}) {

        let responseBody: any = {
            success: false,
            message,
            errors,
            status: status
        };

        return NextResponse.json(responseBody, { status: status });

    }

    static sendValidationErrorResponse(status: number, message: string, errors: any) {
        
        let responseBody: any = {
            success: false,
            message,
            errors,
            status
        }
        return NextResponse.json(responseBody, {status: status});
    }

}