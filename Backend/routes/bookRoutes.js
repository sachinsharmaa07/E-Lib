import express from "express";
import multer from "multer";
import { addBook, getBooks, updateBook, deleteBook, updateBookQuantity } from "../controllers/bookController.js";
import { adminCheck } from "../middleware/adminCheck.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "thumbnail") {
      cb(null, "uploads/images");
    } else if (file.fieldname === "pdf") {
      cb(null, "uploads/pdfs");
    }
  },
  filename: (_, file, cb) => {
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.originalname.replace(/\s+/g, "_")}`;
    cb(null, filename);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "thumbnail") {
      if (file.mimetype.startsWith("image/")) {
        cb(null, true);
      } else {
        cb(new Error("Thumbnail must be an image file"));
      }
    } else if (file.fieldname === "pdf") {
      if (file.mimetype === "application/pdf") {
        cb(null, true);
      } else {
        cb(new Error("PDF field must contain a PDF file"));
      }
    } else {
      cb(null, true);
    }
  }
});

router.get("/", getBooks);
router.post("/", adminCheck, upload.fields([{ name: "thumbnail", maxCount: 1 }, { name: "pdf", maxCount: 1 }]), addBook);
router.put("/:id", adminCheck, upload.fields([{ name: "thumbnail", maxCount: 1 }, { name: "pdf", maxCount: 1 }]), updateBook);
router.put("/:id/quantity", adminCheck, updateBookQuantity);
router.delete("/:id", adminCheck, deleteBook);

export default router;
