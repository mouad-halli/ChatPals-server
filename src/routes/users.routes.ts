import { Router } from 'express'
import userControllers from '../controllers/users.controllers'
import { verifyAuthentication } from '../middlewares/verifyAccessToken.middleware'

const router  = Router()

router.get('/', userControllers.getUser)

router.get('/me', verifyAuthentication, userControllers.getMe)

router.post('/', userControllers.createUser)

router.put('/', userControllers.updateUser)

router.delete('/', userControllers.deleteUser)

export default router