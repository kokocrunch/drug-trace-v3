'use strict';

import { query, Router } from 'express';
const router = Router();

import { signUp, signIn, signOut, verifyEmail, getUser, getDst, getRtl } from '../controller/userController';
import { add, distribute, recall, updateOrder, getBatch, getAllOrders_DST, getComplaints_DST, updateComplaint } from '../controller/distributorController';
import { order, complain, getAllOrders_RTL, getComplaints_RTL } from '../controller/retailController';
import { queryBatch,queryOwnedRetailer, queryOwnedDistributor } from '../controller/queryController';

// user
router.post('/signUp', signUp);
router.post('/login', signIn);
router.post('/logout', signOut);
router.get('/verify/:verifyCode', verifyEmail);
router.get('/getUser', getUser);
router.get('/dst', getDst);
router.get('/rtl', getRtl);

// distributor
router.post('/add', add);
router.post('/distribute', distribute);
router.post('/recall', recall);
router.get('/dst/orders', getAllOrders_DST);
router.get('/dst/complaints', getComplaints_DST)
router.get('/dst/getBatch', getBatch);
router.post('/updateComplaint', updateComplaint);
router.post('/updateOrder', updateOrder);

// retailer
router.post('/order', order);
router.post('/complain', complain);
router.get('/rtl/orders', getAllOrders_RTL);
router.get('/rtl/complaints', getComplaints_RTL);

// query
router.get('/rtl/drugs', queryOwnedRetailer);
router.get('/dst/drugs', queryOwnedDistributor);
router.get('/drugBatch', queryBatch);

export default router;