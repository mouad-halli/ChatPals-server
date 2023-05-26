import { NextFunction, Request, Response } from "express"
import { verifyToken } from "../utils/verifyToken"

export const verifyAuthentication = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const accessToken = req.cookies.accessToken
        req.user = await verifyToken(accessToken, "accessToken")
        next()
        
    } catch (error) {
        next(error)
    }

}