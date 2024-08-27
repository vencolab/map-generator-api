import { Router } from "express";
import multer from "multer";
import { generateMap } from "../controllers/mapController";

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      console.error("Only .png and .jpg/jpeg formats are allowed!");
    }
  },
});

const router = Router();

// POST route for generating maps
router.post("/", upload.single("image"), generateMap);

export default router;