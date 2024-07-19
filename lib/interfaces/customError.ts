export interface CustomErrorInterface {
    status?: number
    errors?: any
    message?: string,
  }
  
  export class CustomError extends Error {
    status?: number
    errors?: any
    validation_error?: boolean
    authorization_error?: boolean
  
    constructor(status?: number, message?: any, errorCode?: string, errors?: any) {
      super(message)
      this.status = status
      this.message = message
      this.errors = errors
    }
  
    setStatusCode(statusCode: number) {
      this.status = statusCode
    }
  
    setMessage(message: string) {
      this.message = message
    }
  }