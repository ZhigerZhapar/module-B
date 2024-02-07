// billingRoutes.js

import express from 'express';
import * as billingController from '../controllers/billingController.js';

const router = express.Router();

// Route for rendering billing quotas page
router.get('/view/:workspace_id', billingController.renderBillingQuotasPage);

// Route for setting billing quotas
router.post('/set', billingController.setBillingQuotaController);

// Route for deleting billing quota
router.post('/delete/:workspace_id', billingController.deleteBillingQuotaController);

export default router;
