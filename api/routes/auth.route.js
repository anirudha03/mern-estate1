import express from 'express';
import {signup, signin, google, signOut} from '../controllers/auth.controller.js'

const router = express.Router();

router.post("/signup", signup); //the second signup is the function imported from controller 
router.post("/signin", signin); 
router.post('/google', google);
router.get('/signout', signOut);

export default router; 