import { CustomError } from "../interfaces/customError";

export class ResourceAlreadyExistsError extends Error {
    constructor(key: string, message: string) {
        super(message);
        const err = new CustomError();
        err.status = 422;
        err.message = "Validation failed";
        err.validation_error = true;

        let errObject: any = {};

        if (key && message) {
            errObject[key] = message;
        }

        err.errors = errObject;

        return err;
    }
}