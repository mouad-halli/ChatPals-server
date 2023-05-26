import { Router } from "express";
import { verifyAuthentication } from "../middlewares/verifyAccessToken.middleware";
import messageController from "../controllers/message.controller";

const router = Router()

router.get('/channel-messages/:channel_id', verifyAuthentication, messageController.getChannelMessages)

export default router