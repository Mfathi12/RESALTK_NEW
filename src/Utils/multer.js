import multer, { diskStorage } from "multer";
import path from "path";

export const fileUpload = () => {
    const fileFilter = (req, file, cb) => {
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "application/pdf",
            'application/msword', // DOC
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
            'application/vnd.ms-powerpoint', // PPT
            'application/vnd.openxmlformats-officedocument.presentationml.presentation' 
        ];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error("Only image and PDF files are allowed"), false);
        }
        cb(null, true);
    };

    const storage = diskStorage({
        destination: "upload/",
        filename: (req, file, cb) => {
            cb(null, Date.now() + path.extname(file.originalname));
        }
    });

    return multer({ storage, fileFilter });
};
