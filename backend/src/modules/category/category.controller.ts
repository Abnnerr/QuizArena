import type { Response, Request } from "express";
import { AppError } from "../../error/AppError.js";
import { HttpResponse } from "../../shared/response/httpResponse.js";
import type { ResponseDTO } from "../../types/generic.js";
import type { CategoryService } from "./category.service.js";
import type { CreateCategoryDTO } from "./schema/createCategory.js";

export class CategoryController {
    constructor(private readonly service: CategoryService) {
        this.categoryCreate = this.categoryCreate.bind(this)
        this.findCategoryId = this.findCategoryId.bind(this)
        this.findCategories = this.findCategories.bind(this)
        this.categories = this.categories.bind(this)
    }

    async categoryCreate(req: Request<{ categoryId: string }, {}, CreateCategoryDTO, {}, {}>, res: Response<ResponseDTO>): Promise<Response> {
        try {
            await this.service.categoryCreate(req.body.name, Number(req.params.categoryId))
            
            return HttpResponse.success(res, 201, "categoria criado")
        } catch (error) {
            if (error instanceof AppError) {
                return HttpResponse.warning(res, error.status, error.message)
            }
            return HttpResponse.warning(res, 500, 'Erro ao criar Cateogoria')
        }
    }
    async findCategoryId(req: Request<{ categoryId: string }, {}, CreateCategoryDTO, { onlyMine: string }, {}>, res: Response<ResponseDTO>): Promise<Response> {
        try {
            const result = await this.service.categoryFindId(
                Number(req.params.categoryId),
                req.user?.id!,
                Boolean(req.query.onlyMine)
            )
            return HttpResponse.success(res, 201, "categoria criado", result)
        } catch (error) {
            if (error instanceof AppError) {
                return HttpResponse.warning(res, error.status, error.message)
            }
            return HttpResponse.warning(res, 500, 'Erro ao criar Cateogoria')
        }
    }
    async findCategories(req: Request<{}, {}, CreateCategoryDTO, {}, {}>, res: Response<ResponseDTO>): Promise<Response> {
        try {
            const result = await this.service.findCategories(req.user?.id!)
            return HttpResponse.success(res, 201, "categoria criado", result)
        } catch (error) {
            if (error instanceof AppError) {
                return HttpResponse.warning(res, error.status, error.message)
            }
            return HttpResponse.warning(res, 500, 'Erro ao criar Cateogoria')
        }
    }
    async categories(_req: Request<{}, {}, {}, {}, {}>, res: Response<ResponseDTO>): Promise<Response> {
        try {
            const result = await this.service.categories()
            return HttpResponse.success(res, 201, "categoria criado", result)
        } catch (error) {
            if (error instanceof AppError) {
                return HttpResponse.warning(res, error.status, error.message)
            }
            return HttpResponse.warning(res, 500, 'Erro ao criar Cateogoria')
        }
    }

}