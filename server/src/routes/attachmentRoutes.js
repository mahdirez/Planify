import { Router } from "express";
import { upload } from "../config/upload.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
    uploadAttachment,
    getTaskAttachments,
    downloadAttachment,
    deleteAttachment,
} from "../controller/attachmentController.js";

const router = Router();

router.post("/tasks/:taskId/attachments", upload.single("file"), asyncHandler(uploadAttachment));
router.get("/tasks/:taskId/attachments", asyncHandler(getTaskAttachments));
router.get("/attachments/:attachmentId/download", asyncHandler(downloadAttachment));
router.delete("/attachments/:attachmentId", asyncHandler(deleteAttachment));

export default router;