const apiRouter = require('express').Router();
const userController = require('./controllers/userController');
const adminController = require('./controllers/adminController');
const homeController = require('./controllers/homeController');
const resController = require('./controllers/resController');



apiRouter.post('/login', userController.apiLogin);
apiRouter.post('/addUser/',  userController.apiMustBeLoggedIn,userController.apiAddUser);
apiRouter.post('/addHome/',  userController.apiMustBeLoggedIn,homeController.apiAddHome);
apiRouter.post('/deleteUser/:id',  userController.apiMustBeLoggedIn,userController.apiDeleteUser);
apiRouter.post('/deleteHome/:id',  userController.apiMustBeLoggedIn,homeController.apiDeleteHome);
apiRouter.post('/updateUser/:id', userController.apiMustBeLoggedIn,userController.apiUpdateUser);
apiRouter.post('/updateHome/:id', userController.apiMustBeLoggedIn,homeController.apiUpdateHome);
apiRouter.post('/makeReservation/:id', userController.apiMustBeLoggedIn, resController.apiMakeReservation);
apiRouter.post('/deleteReservation/:id', resController.apiDeleteReservation);
apiRouter.post('/updateReservation/:id', userController.apiMustBeLoggedIn, resController.apiUpdateReservation);
apiRouter.post('/setReservationClean/', userController.apiMustBeLoggedIn, resController.reservationCleaned);


apiRouter.get('/getMenuData', adminController.apiGetMenuData);
apiRouter.get('/getReservations/:id', resController.apiGetReservations);
apiRouter.get('/getUser/:id', userController.apiGetUserById);
apiRouter.get('/getHome/:id', homeController.apiGetHomeById);
apiRouter.get('/getKeeper/:id', userController.apiGetUserById);






module.exports = apiRouter;