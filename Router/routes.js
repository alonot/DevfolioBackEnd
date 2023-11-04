const express = require('express')
const ReviewCltr=require('./routesController.js')
const router= express.Router()

router.route('/auth/').get(ReviewCltr.authenticate)
router.route('/test/').post(ReviewCltr.tester)
router.route('/login/').post(ReviewCltr.login)
router.route('/logout/').get(ReviewCltr.logout)

router.route('/cart').get(ReviewCltr.getCart)
                    .put(ReviewCltr.putCart)
router.route('/plan').get(ReviewCltr.getPlan)
                    .put(ReviewCltr.putPlan)

router.route('/:username').get(ReviewCltr.getUser)
router.route('/').get(ReviewCltr.getAllUsers)
.post(ReviewCltr.postUser)




module.exports=router