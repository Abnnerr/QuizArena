
import type { PowerService } from "./powers.service.js";

export class PowerController {
    constructor(private readonly service: PowerService) {

    }

    // async usePower(req: Request<{}, {}, {}, {}>, res: Response<ResponseDTO>): Promise<Response> {
    //     try {
    //         await this.service.usePower(req)
    //         HttpResponse.success(res, 200, 'Poder Usado')
    //     } catch (error) {
    //         if (error instanceof AppError) {
    //             HttpResponse.warning(res, error.status, error.message)
    //         }
    //     }
    // }
}