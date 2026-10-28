import type { NextFunction, Request, Response } from "express";
export declare class PolicyMiddleware {
    static ensureRolePermission(permission: string, ...roles: string[]): (req: Request, _res: Response, next: NextFunction) => void;
}
//# sourceMappingURL=policy.middleware.d.ts.map