import type { AuthPayload } from '../../types/generic.js';
export declare class JwtService {
    sign(id: string, role: string, permissions: string[], tempo: string): string;
    verify(token: string): AuthPayload;
}
//# sourceMappingURL=jwt.service.d.ts.map