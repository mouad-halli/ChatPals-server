import { Router } from 'express'
import authController from '../controllers/authentication.controller'
import { verifyRefreshToken } from '../middlewares/verifyRefreshToken.middleware'
import { verifyAuthentication } from '../middlewares/verifyAccessToken.middleware'
import passport from 'passport'
import '../passport'
import { validateBody } from '../middlewares/validateBody.middleware'
import { validateLogin, validateRegister } from '../validations/authValidation'

const router = Router()

router.post('/register', validateBody(validateRegister), authController.register)

router.post('/login', validateBody(validateLogin), authController.login)

router.get('/logout', verifyAuthentication, authController.logout)

router.get('/refresh-token', verifyRefreshToken, authController.refreshAccessToken)

router.get('/google', passport.authenticate('google',{ scope: ['profile', 'email'] }))

router.get('/google/callback', passport.authenticate('google', {session: false}), authController.googleAuth)

export default router