import * as v from 'valibot';
import { ResponseHelper } from '../helpers/reponseHelper';

export function validate(schema:any, reqData:any){
    try {
        reqData = v.safeParse(schema, reqData);
        if (!reqData.success) {
            const errors: any = {};
            reqData.issues.forEach((issue: any) => {
                const path = issue.path.map((p: any) => p.key);
                const message = getCustomErrorMessage(issue);

                errors[path] = message;
            });
            return errors;
        }
    } catch (error: any) {
        console.log(error);
        return ResponseHelper.sendErrorResponse(500, 'Something went wrong');
    }
};

function getCustomErrorMessage(issue: any) {
    const key = formatKey(issue.path[0].key);
    switch (issue.type) {
        case 'non_empty':
            return `${key} is Required`
        case 'email':
            return `Invalid ${key}`
        
        case 'min_length':
            return `${key} should be ${issue.expected} characters`
        
        case 'max_length':
            return `${key} should be ${issue.expected} characters`
        
        case 'regex':
            return `Invalid ${key}`
        
        case 'enum':
            return `Invalid ${key}`
        
        case 'non_nullable' :
            return `${key} is Required`
        
        case 'array':
            return `Invalid ${key}`
        
        case 'number':
            return `Invalid ${key}`
        
        case 'string':
            return `Invalid ${key}`
        
        default:
            break
    }

    if(issue.input === undefined) {
        return `${key} is Required`
    }
}

function formatKey(key: string): string {
    return key
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}
