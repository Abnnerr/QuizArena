import { prisma } from "../../db/index.js"
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
}