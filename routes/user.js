import express from 'express'
import { registerNewUser, loginUser, getUserbyUsername, followUser, unfollowUser, searchUsers } from '../controllers/user.js'
import { requireLogin } from '../utils/auth.js'

const router = express.Router()

router.post('/register', registerNewUser)
router.post('/login', loginUser)
router.use(requireLogin)
router.get('/:username', getUserbyUsername)
router.post('/:username/follow', followUser)
router.post('/:username/unfollow', unfollowUser)
router.post('/search', searchUsers)

export default router