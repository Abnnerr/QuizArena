declare global {
    namespace Express {
        export interface Request {   
            validatedParams?: any
            user?: {
                id: string,
                role: string,
                permissions: string[]
            }
        

        }
    }
}

export {}