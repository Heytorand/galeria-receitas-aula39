import multer from "multer";
import path from "path";

// b) diskStorage: destination = "uploads/", filename = timestamp + extensao
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // timestamp único + extensão original do arquivo
    const timestamp = Date.now();
    const extensao = path.extname(file.originalname);
    cb(null, `${timestamp}${extensao}`);
  }
});

// c) fileFilter: aceitar apenas image/jpeg, image/png, image/gif, image/webp
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Tipo nao permitido"));
  }
};

// d) limits: fileSize = 5 * 1024 * 1024 (5MB)
// e) Exportar upload
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});