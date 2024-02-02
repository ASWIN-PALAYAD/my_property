import express from 'express';
import { deleteUser, test, updateUserInfo,getUserListing,getUser } from '../controllers/userController.js';
import { verifyToken } from '../utils/verifyUser.js';

const userRouter = express.Router();

userRouter.get('/test',test)
userRouter.post('/update/:id',verifyToken,updateUserInfo);
userRouter.delete('/delete/:id',verifyToken,deleteUser);
userRouter.get('/listings/:id',verifyToken,getUserListing);
userRouter.get('/:id',verifyToken,getUser);

export default userRouter;