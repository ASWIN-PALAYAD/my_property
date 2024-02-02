import express from 'express';
import { createListing,deleteListing,updateListing,getSingleListing,getAllListings } from '../controllers/listingController.js';
import { verifyToken } from '../utils/verifyUser.js';



const router = express.Router();

router.post('/create',verifyToken,createListing);
router.delete('/delete/:id',verifyToken,deleteListing);
router.post('/update/:id',verifyToken,updateListing);
router.get('/getSingleListing/:id',getSingleListing);
router.get('/get',getAllListings);





export default router;