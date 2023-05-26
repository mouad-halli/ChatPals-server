import { Router } from 'express'
import userControllers from '../controllers/user.controller'
import { verifyAuthentication } from '../middlewares/verifyAccessToken.middleware'
import { multerOptions } from '../config/multer'
import multer from 'multer'
import { validateBody } from '../middlewares/validateBody.middleware'
import { validateUpdateUser } from '../validations/updateUserValidation'

const router  = Router()

const upload = multer(multerOptions)

router.get('/me', verifyAuthentication, userControllers.getMe)

router.put('/', verifyAuthentication, validateBody(validateUpdateUser), userControllers.updateUser)

router.put('/upload/image', verifyAuthentication, upload.single('image'), userControllers.updateUserImage)

export default router