import express from 'express'
import { checkIfLiked, createPost, deletePost, editPostCaption, getAllPosts, getPostById, getSubscribedPosts, likePostToggle, uploadContentToCloudinary } from '../controllers/post.js'
import { requireLogin } from '../utils/auth.js'
import { multerUploads } from '../utils/multer.js'

const router = express.Router()
router.use(requireLogin)

router.get('/getallposts', getAllPosts)
router.get('/post/:postid', getPostById)
router.get('/getsubscribedposts', getSubscribedPosts)
router.get('/:postid/checklikes', checkIfLiked)
router.post('/upload', multerUploads.single('image'), uploadContentToCloudinary) 
router.post('/createpost', createPost)
router.post('/:postid/togglelike', likePostToggle)
router.delete('/:postid/deletepost', deletePost)
router.put('/:postid/editpost', editPostCaption)


export default router
