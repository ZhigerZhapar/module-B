// workspaceRoutes.js

import express from 'express';
import * as workspaceController from '../controllers/workspaceController.js';

const router = express.Router();    

// Добавляем роуты для управления рабочими пространствами
router.post('/workspaces', workspaceController.createWorkspace);
router.post('/delete-item/:workspace_id', workspaceController.deleteWorkspace);
router.get('/update-workspaces', workspaceController.updateWorkspacesList);
router.get('/edit-workspace/:workspace_id', workspaceController.editWorkspacePage);
// Добавляем маршрут для обработки формы обновления пространсsтва
router.post('/update-workspace/:workspace_id', workspaceController.updateWorkspace);




// router.post('/workspaces/:workspace_id/billing-quotas', workspaceController.updateBillingQuota);
// router.get('/billing-quotas/:workspace_id', workspaceController.getBillingQuotaPage);

export default router;
