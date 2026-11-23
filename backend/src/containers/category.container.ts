import { CategoryController } from "../modules/category/category.controller.js";
import { CategoryRepository } from "../modules/category/category.repository.js";
import { CategoryService } from "../modules/category/category.service.js";

const categoryRepo = new CategoryRepository()
const categoryService = new CategoryService(categoryRepo)
const categoryController = new CategoryController(categoryService)



export default categoryController