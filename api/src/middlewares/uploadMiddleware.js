import multer from 'multer';

// Armazena arquivos em memória RAM como Buffer para envio direto ao Storage
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic'];
  
  if (allowedMimeTypes.includes(file.mimetype.toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error('Formato de arquivo inválido. Envie apenas imagens (JPEG, PNG, WEBP).'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 25 * 1024 * 1024 // Limite máximo de 25MB por foto
  }
});
