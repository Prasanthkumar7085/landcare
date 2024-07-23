import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { UserDataServiceProvider } from "../services/userDataServiceProvider";

const userdataServiceProvider = new UserDataServiceProvider();


export async function hasAccessToken(token:any) {
    if (token) return true
    return false
}

export async function validToken(token:any) {
    const decodedToken = jwt.decode(token);
    if (decodedToken) return true
    return false
}

export async function validUser(token:any) {
    const decodedToken :any = jwt.decode(token);
    if (decodedToken) {
        const user = await userdataServiceProvider.findById(decodedToken.id)
        if (user) return user
        return false
    } else {
        return false
    }
}



