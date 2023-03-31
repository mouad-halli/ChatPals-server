import { Router } from 'express'
import authController from '../controllers/authentication.controllers'
import { verifyRefreshToken } from '../middlewares/verifyRefreshToken.middleware'
import { verifyAuthentication } from '../middlewares/verifyAccessToken.middleware'

const router = Router()

router.post('/register', authController.register)

router.post('/login', authController.login)

router.get('/logout', verifyAuthentication, authController.logout)

router.get('/refresh-token', verifyRefreshToken, authController.refreshAccessToken)

export default router