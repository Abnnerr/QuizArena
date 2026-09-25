declare global {
    namespace Express {
        export interface Request {   
            validatedParams?: any
            user?: {
                id: number,
                role: string
            }
        

        }
    }
}

export {}