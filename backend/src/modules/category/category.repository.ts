import { prisma } from "../../db/index.js"

export class CategoryRepository {
    async categoryCreate(name: string, libraryId: number): Promise<void> {
        try {
            await prisma.category.create({
                data: {
                    title: name,
                    library_id: libraryId
                }
            })
        } catch (error) {
            throw error
        }
    }
    async categoryFind(name: string, libraryId: number): Promise<any> {
        try {
            return await prisma.category.findFirst({
                where: {
                    title: name,
                    library_id: libraryId
                }
            })
        } catch (error) {
            throw error
        }
    }

    async findCategoryId(categoryId: number, userId: string, mine: boolean) {

        const where = mine ? { user_id: userId } : { isPublic: true }

        return await prisma.category.findUnique({
            where: {
                category_id: categoryId,
            },
            include: {
                questions: {
                    where,
                    include: {
                        alternatives: true,
                    },
                },
            },
        });
    }
    async findCategories(userId: string) {
        return await prisma.category.findMany({
            where: {
                questions: {
                    some: {
                        user_id: userId,
                    },
                },
            },
            select: {
                category_id: true,
                title: true,
                library_id: true,
                _count: {
                    select: {
                        questions: {
                            where: {
                                user_id: userId,
                            },
                        },
                    },
                },
            },
        });
    }
    async categories() {
        return await prisma.category.findMany({
            select: {
                category_id: true,
                title: true
            }
        })
    }
}