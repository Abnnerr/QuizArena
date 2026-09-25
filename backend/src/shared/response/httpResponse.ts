import type { Response } from "express";

export class HttpResponse {
    static success(res: Response, status: number = 200, message: string, data?: any) {
        return res.status(status).json({
            type: 'Success',
            message,
            data
        })
    }
    static warning(res: Response, status: number = 400, message: string, error?: any) {
        return res.status(status).json({
            type: 'Warning',
            message,
            error
        })
    }
}