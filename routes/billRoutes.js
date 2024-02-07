// billRoutes.js
import express from 'express';
import * as billController from '../controllers/billController.js';

const router = express.Router();

// Update the route for viewing bills to include workspace_id
router.get('/view/:workspace_id', billController.renderBillsPage);

// Add a new route for opening monthly bills
router.get('/open/:workspace_id/:month', billController.viewMonthlyBill);

export default router;
