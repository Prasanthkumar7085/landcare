



export class AuthMiddleware {
    async validateAccessToken(req: any, res: any, next: any) {
        if (!req.headers.authorization) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const token = req.headers.authorization.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        next();
    }   

}