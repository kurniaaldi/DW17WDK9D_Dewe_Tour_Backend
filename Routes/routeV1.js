const express = require('express')

const router = express.Router()
const fileUpload = require("express-fileupload");

const { read, register, readOne, login, destroyUser, updateProfile } = require('../Controller/database/user')
const { readCountry, oneCountry, addCountry, destroyCountry, editCountry } = require('../Controller/database/country')
const { readTrip, oneTrip, createTrip, destroyTrip, patchTrip } = require('../Controller/database/trip')
const { readTransaction, newTransaction, updateTransaction, oneTransaction, approveTrip } = require('../Controller/database/transaction')
const { authenticated } = require('../middleware/auth')

//user
router.get('/users', authenticated, read)
router.get('/user/:id', authenticated, readOne)
router.patch('/user/:id', authenticated, fileUpload(), updateProfile)
router.post('/register', register)
router.post('/login', login)
router.delete('/user/:id', authenticated, destroyUser)



//country
router.get('/country', readCountry)
router.get('/country/:id', oneCountry)
router.post('/add-country', authenticated, addCountry)
router.delete('/destroy-country/:id', authenticated, destroyCountry)
router.put('/patch-country/:id', authenticated, editCountry)

//trip
router.get('/trip', readTrip)
router.get('/trip/:id', oneTrip)
router.post('/trip', authenticated, fileUpload(), createTrip)
router.delete('/trip/:id', authenticated, destroyTrip)
router.patch('/trip/:id', authenticated, patchTrip)

//transaction
router.get('/transaction', authenticated, readTransaction)
router.get('/transaction/:id', authenticated, oneTransaction)
router.post('/transaction', authenticated, newTransaction)
router.patch('/transaction/:id', authenticated, fileUpload(), updateTransaction)
router.patch('/approve/:id', authenticated, approveTrip)



module.exports = router