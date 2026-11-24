import { AppError } from "../../error/AppError.js";
import type { LibraryRepository } from "./library.repository.js";
import type { CreateLibraryDTO } from "./schema/createLibrary.js";

export class LibraryService {
    constructor(private readonly repo: LibraryRepository) {

    }

    async libraryCreate(dados: CreateLibraryDTO) {
        try {
            await this.repo.libraryCreate(dados)
        } catch (error) {
            if (error instanceof AppError) {
                throw error
            }
            throw new AppError(500, 'Erro ao criar Library')
        }
    }
    async librariesFind() {
        try {
            return await this.repo.librariesFind()
        } catch (error) {
            console.log(error);

            if (error instanceof AppError) {
                throw error
            }
            throw new AppError(500, 'Erro ao criar Library')
        }
    }
    async libraryFindId(libraryId: number) {
        try {
            return await this.repo.libraryFindId(libraryId)
        } catch (error) {
            console.log(error);

            if (error instanceof AppError) {
                throw error
            }
            throw new AppError(500, 'Erro ao criar Library')
        }
    }
    async libraryDelete(libraryId: number) {
        try {
            return await this.repo.libraryFindId(libraryId)
        } catch (error) {
            console.log(error);

            if (error instanceof AppError) {
                throw error
            }
            throw new AppError(500, 'Erro ao criar Library')
        }
    }
}