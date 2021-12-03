const express = require('express')
const router = express.Router()
const auth = require('../auth')
const Top5ListController = require('../controllers/top5list-controller')

router.post('/top5list', auth.verify, Top5ListController.createTop5List)
router.delete('/top5list/:id', auth.verify, Top5ListController.deleteTop5List)
router.put('/top5list/:id', auth.verify, Top5ListController.updateTop5List)
router.post('/publishTop5List/:id', auth.verify, Top5ListController.publishTop5List)

router.get('/top5list/:id', auth.verify, Top5ListController.getTop5ListById)
router.get('/top5listpairs', auth.verify, Top5ListController.getTop5ListPairs)
router.post('/personaltop5lists', auth.verify, Top5ListController.getPersonalLists)
router.post('/allLists', auth.verify, Top5ListController.getAllLists)
router.post('/otheruserslists', auth.verify, Top5ListController.getOtherUsersLists)
router.post('/communitylists', auth.verify, Top5ListController.getCommunityLists)
router.get('/top5lists', auth.verify, Top5ListController.getTop5Lists)

router.post('/addcomment/:id', auth.verify, Top5ListController.addNewComment)
router.post('/addcommunitycomment/:id', auth.verify, Top5ListController.addNewCommunityComment)
router.post(`/getcomments/:id`, auth.verify, Top5ListController.getComments)
router.post(`/getcommunitylistrefs/:id`, auth.verify, Top5ListController.getCommunityListRefs)

router.post(`/addorremovelike/:id`, auth.verify, Top5ListController.addOrRemoveLike)
router.post(`/addorremovedislike/:id`, auth.verify, Top5ListController.addOrRemoveDislike)
router.post(`/addorremovelikecommunity/:id`, auth.verify, Top5ListController.addOrRemoveLikeCommunity)
router.post(`/addorremovedislikecommunity/:id`, auth.verify, Top5ListController.addOrRemoveDislikeCommunity)

module.exports = router