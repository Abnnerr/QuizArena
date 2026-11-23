import { AppError } from "../../error/AppError.js";
import type { CategoryRepository } from "./category.repository.js";

export class CategoryService {
    constructor(
        private readonly repo: CategoryRepository
    ) { }


    async categoryCreate(name: string, libraryId: number): Promise<void> {
        try {
            const category = await this.repo.categoryFind(name, libraryId)
            if (category) {
                throw new AppError(400, 'essa categoria ja existe nessa library')
            }
            await this.repo.categoryCreate(name, libraryId)
        } catch (error) {
            console.log(error);

            if (error instanceof AppError) {
                throw error
            }
            throw new AppError(500, 'Erro ao criar Categoria')
        }
    }

    async categoryFindId(categoryId: number, userId: string, mine: boolean) {
        try {
            const result = await this.repo.findCategoryId(categoryId, userId, mine)

            return result
        } catch (error) {
            if (error instanceof AppError) {
                throw error
            }
            throw new AppError(500, 'Erro ao criar Categoria')
        }
    }
    async findCategories(userId: string) {
        try {
            const result = await this.repo.findCategories(userId)

            return result
        } catch (error) {
            if (error instanceof AppError) {
                throw error
            }
            throw new AppError(500, 'Erro ao criar Categoria')
        }
    }

    //buscar todas as categorias id e title
    async categories() {
        try {
            const result = await this.repo.categories()

            return result
        } catch (error) {
            if (error instanceof AppError) {
                throw error
            }
            throw new AppError(500, 'Erro ao criar Categoria')
        }
    }
}