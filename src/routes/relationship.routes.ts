import { Router } from "express";
import { verifyAuthentication } from "../middlewares/verifyAccessToken.middleware";
import relationshipController from '../controllers/relationship.controller'

const router = Router()

router.get('/strangers', verifyAuthentication, relationshipController.getStrangers)

router.get('/friends', verifyAuthentication, relationshipController.getFriends)

router.get('/received/pending', verifyAuthentication, relationshipController.getReceivedFriendRequstsUsers)

export default router