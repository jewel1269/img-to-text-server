import express from "express";
import uploadImage from "../controller/controller.js";



const router = express.Router();

router.post("/image-upload", uploadImage);

export default router;
