import { prisma } from "../../db/index.js"
import { AppError } from "../../error/AppError.js"
import type { CreateLibraryDTO } from "./schema/createLibrary.js"

export class LibraryRepository {
    async libraryCreate(dados: CreateLibraryDTO) {
        try {
            await prisma.libraries.create({
                data: {
                    title: dados.title,
                    description: dados.description
                }
            })
        } catch (error) {
            throw error
        }
    }
    async librariesFind() {
        try {
            return await prisma.libraries.findMany({
                include: {
                    _count: {
                        select: {
                            categories: true,
                        },
                    },
                    categories: {
                        include: {
                            _count: {
                                select: {
                                    questions: {
                                        where: {
                                            isPublic: true
                                        }
                                    },
                                },
                            },
                        },
                    },
                }
            })
        } catch (error) {
            throw error
        }
    }
    async libraryFindId(libraryId: number) {
        return await prisma.libraries.findUnique({
            where: {
                library_id: libraryId,
            },
            select: {
                library_id: true,
                title: true,
                description: true,
                categories: {
                    select: {
                        category_id: true,
                        title: true,
                        _count: {
                            select: {
                                questions: {
                                    where: {
                                        isPublic: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
    }

    async deleteLibrary(libraryId: number) {
        return await prisma.$transaction(async (tx) => {
            // 1. Verifica se a biblioteca existe
            const library = await tx.libraries.findUnique({
                where: { library_id: libraryId },
            });

            if (!library) {
                throw new Error("Biblioteca não encontrada.");
            }

            // 2. Busca as categorias
            const categories = await tx.category.findMany({
                where: { library_id: libraryId },
                select: { category_id: true },
            });

            const categoryIds = categories.map(
                (category) => category.category_id
            );

            // 3. Busca as perguntas
            const questions = await tx.questions.findMany({
                where: {
                    category_id: { in: categoryIds },
                },
                select: { question_id: true },
            });

            const questionIds = questions.map(
                (question) => question.question_id
            );

            // 4. Verifica se alguma pergunta já foi utilizada
            const rounds = await tx.round.count({
                where: {
                    question_id: { in: questionIds },
                },
            });

            if (rounds > 0) {
                throw new AppError(500,"Não é possível excluir esta biblioteca. Existem perguntas utilizadas em partidas."
);
            }

            // 5. Exclui as relações com salas
            await tx.roomQuestion.deleteMany({
                where: {
                    question_id: { in: questionIds },
                },
            });

            // 6. Exclui as alternativas
            await tx.alternatives.deleteMany({
                where: {
                    question_id: { in: questionIds },
                },
            });

            // 7. Exclui as perguntas
            await tx.questions.deleteMany({
                where: {
                    category_id: { in: categoryIds },
                },
            });

            // 8. Exclui as categorias
            await tx.category.deleteMany({
                where: { library_id: libraryId },
            });

            // 9. Exclui a biblioteca
            return await tx.libraries.delete({
                where: { library_id: libraryId },
            });
        });
    }

}