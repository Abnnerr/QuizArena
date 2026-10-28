import type { Response } from "express";
export declare class HttpResponse {
    static success(res: Response, status: number | undefined, message: string, data?: any): Response<any, Record<string, any>>;
    static warning(res: Response, status: number | undefined, message: string, error?: any): Response<any, Record<string, any>>;
}
//# sourceMappingURL=httpResponse.d.ts.map