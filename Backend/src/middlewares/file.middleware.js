import multer, { memoryStorage } from "multer";

export const upload = multer({
    storage: memoryStorage(),
    limits: {
        fileSize: 3 * 1024 * 1024 
    }
})
