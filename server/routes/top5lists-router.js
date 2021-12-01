const express = require('express')
const router = express.Router()
const auth = require('../auth')
const Top5ListController = require('../controllers/top5list-controller')

router.post('/top5list', auth.verify, Top5ListController.createTop5List)
router.delete('/top5list/:id', auth.verify, Top5ListController.deleteTop5List)
router.get('/top5list/:id', auth.verify, Top5ListController.getTop5ListById)
router.get('/top5listpairs', auth.verify, Top5ListController.getTop5ListPairs)
router.post('/personaltop5lists', auth.verify, Top5ListController.getPersonalLists)
router.post('/allLists', auth.verify, Top5ListController.getAllLists)
router.post('/otheruserslists', auth.verify, Top5ListController.getOtherUsersLists)
router.post('/communitylists', auth.verify, Top5ListController.getCommunityLists)
router.get('/top5lists', auth.verify, Top5ListController.getTop5Lists)
router.put('/top5list/:id', auth.verify, Top5ListController.updateTop5List)
router.post('/publishTop5List/:id', auth.verify, Top5ListController.publishTop5List)

module.exports = router