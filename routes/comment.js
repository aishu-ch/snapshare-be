import express from 'express'
import { requireLogin } from '../utils/auth.js'
import { addComment, getCommentsWithUserData, deleteComment } from '../controllers/comment.js'

const router = express.Router()
router.use(requireLogin)

router.post('/:postid/addcomment', addComment)
router.get('/:postid/getcomments', getCommentsWithUserData)
router.delete('/:postid/:commentId/deletecomment', deleteComment)

export default router