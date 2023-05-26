import { Router } from "express";
import { verifyAuthentication } from "../middlewares/verifyAccessToken.middleware";
import channelController from "../controllers/channel.controller";

const router = Router()

router.get('/user-channels', verifyAuthentication, channelController.getUserChannels)

router.get('/:channel_id', verifyAuthentication, channelController.getChannel)

export default router