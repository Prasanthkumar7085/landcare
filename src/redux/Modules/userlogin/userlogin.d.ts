declare namespace IReduxUserLogin {
  export interface ICreateUserPayload {
    name: string;
  }

  export interface UserDetails {
    id: number;
    status: string;
    user_type: string;
    phone: boolean;
    email: string;
    full_name: string;
    last_active_at: any;
    created_at: string;
    updated_at: string;
  }

  export interface IUserResponse {
    userDetails: UserDetails
    access_token: string;
    refresh_token: string;
    message?: string;
  }

  export interface IInitialLoginState {
    user: Partial<IUserResponse>;
    emailWhilePasswordReset: string
    singleDevice: any
    singleUser: any
  }


  export interface IUserErrorResponse {
    success: boolean;
    message: string;
    status?: string;
  }

  export interface ICreateUserPayload {
    id: number;
    email: string;
    password: string;
  }
  export interface IUser {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    avatar: string;
    password: string;
  }
}

export { IReduxUserLogin };
