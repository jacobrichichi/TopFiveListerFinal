const express = require('express')
const router = express.Router()
const auth = require('../auth')
const Top5ListController = require('../controllers/top5list-controller')

router.post('/top5list', auth.verify, Top5ListController.createTop5List)
router.delete('/top5list/:id', auth.verify, Top5ListController.deleteTop5List)
router.get('/top5list/:id', auth.verify, Top5ListController.getTop5ListById)
router.get('/top5listpairs', auth.verify, Top5ListController.getTop5ListPairs)
router.get('/personaltop5lists', auth.verify, Top5ListController.getPersonalLists)
router.get('/allLists', auth.verify, Top5ListController.getAllLists)
router.get('/otheruserslists', auth.verify, Top5ListController.getOtherUsersLists)
router.get('/communitylists', auth.verify, Top5ListController.getCommunityLists)
router.get('/top5lists', auth.verify, Top5ListController.getTop5Lists)
router.put('/top5list/:id', auth.verify, Top5ListController.updateTop5List)

module.exports = router