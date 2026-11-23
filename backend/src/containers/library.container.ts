import { LibraryController } from "../modules/library/library.controller.js";
import { LibraryRepository } from "../modules/library/library.repository.js";
import { LibraryService } from "../modules/library/library.service.js";

const libraryRepo = new LibraryRepository()
const libraryService = new LibraryService(libraryRepo)
const libraryController = new LibraryController(libraryService)


export default libraryController