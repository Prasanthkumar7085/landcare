import * as v from "valibot";
import { ResponseHelper } from "../helpers/reponseHelper";

export function validate(schema: any, reqData: any) {
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
    console.error(error);
    return ResponseHelper.sendErrorResponse(500, "Something went wrong");
  }
}

function getCustomErrorMessage(issue: any) {
  const key = formatKey(issue.path[0].key);
  switch (issue.type) {
    case "non_empty":
      return `${key} is required`;

    case "min_length":
      return `${key} must be atleast ${issue.requirement} characters`;

    case "max_length":
      return `${key} should not exceed ${issue.requirement} characters.`;

    case "regex":
      return `${key} is invalid`;

    case "enum":
      return `${key} is invalid`;

    case "non_nullable":
      return `${key} is required`;

    case "array":
      return `${key} are invalid `;

    case "number":
      return `${key} is invalid`;

    case "string":
      return `${key} is invalid`;

    case "email":
      return `${key} is invalid`;
    
    case "url":
      return `${key} is invalid`;
    
    case "raw_transform":
      return issue.message;

    default:
      break;
  }

  if (issue.input === undefined) {
    return `${key} is required`;
  }
}

function formatKey(key: string): string {
  return key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
