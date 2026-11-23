import { AppError } from "../../error/AppError.js";
import { HttpResponse } from "../../shared/response/httpResponse.js";
import type { ResponseDTO } from "../../types/generic.js";
import type { LibraryService } from "./library.service.js";
import type { Request, Response } from 'express'
import type { CreateLibraryDTO } from "./schema/createLibrary.js";

export class LibraryController {
    constructor(private readonly service: LibraryService) {
        this.libraryCreate = this.libraryCreate.bind(this)
        this.librariesFind = this.librariesFind.bind(this)
        this.libraryFindId = this.libraryFindId.bind(this)
    }
    async libraryCreate(req: Request<{}, {}, CreateLibraryDTO, {}, {}>, res: Response<ResponseDTO>): Promise<Response> {
        try {
            await this.service.libraryCreate(req.body)
            return HttpResponse.success(res, 201, 'library criado')
        } catch (error) {
            if (error instanceof AppError) {
                return HttpResponse.warning(res, error.status, error.message)
            }
            return HttpResponse.warning(res, 500, 'Erro ao criar Library')
        }
    }
    async librariesFind(_req: Request<{}, {}, {}, {}, {}>, res: Response<ResponseDTO>): Promise<Response> {
        try {
            const result = await this.service.librariesFind()

            return HttpResponse.success(res, 200, 'libraries encontrados', result)
        } catch (error) {
            if (error instanceof AppError) {
                return HttpResponse.warning(res, error.status, error.message)
            }
            return HttpResponse.warning(res, 500, 'Erro ao criar Library')
        }
    }
    async libraryFindId(req: Request<{ libraryId: string }, {}, {}, {}, {}>, res: Response<ResponseDTO>): Promise<Response> {
        try {
            const result = await this.service.libraryFindId(Number(req.params.libraryId))

            return HttpResponse.success(res, 200, 'library encontrado', result)
        } catch (error) {
            if (error instanceof AppError) {
                return HttpResponse.warning(res, error.status, error.message)
            }
            return HttpResponse.warning(res, 500, 'Erro ao criar Library')
        }
    }
}