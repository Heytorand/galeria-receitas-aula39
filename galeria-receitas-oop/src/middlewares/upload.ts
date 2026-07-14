// ============================================================
// TODO 1: Configurar o Multer para upload de imagens
// ============================================================
// Importar multer e path
//
// Criar diskStorage:
//   destination: "uploads/"
//   filename: Date.now() + random + extensao (path.extname)
//
// Criar fileFilter:
//   aceitar: image/jpeg, image/png, image/gif, image/webp
//   rejeitar: cb(new Error("Tipo nao permitido"), false)
//
// Exportar:
//   export const upload = multer({ storage, fileFilter, limits: { fileSize: 5*1024*1024 } });
// ============================================================

