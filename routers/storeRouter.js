const express = require('express');
const storeRouter = express.Router();
const storeController = require('../controllers/storeController');

storeRouter.get('/', storeController.getHome);
storeRouter.get('/home-list', storeController.getHomeList);
storeRouter.get('/favorite-list', storeController.getFavoriteList);

storeRouter.get('/home-details/:id', storeController.getHomeDetails);

storeRouter.post('/add-to-favorite/:id', storeController.addToFavorite);
storeRouter.post('/remove-from-favorite/:id', storeController.removeFromFavorite);

storeRouter.get('/bookings', storeController.getBookings);

module.exports = storeRouter;