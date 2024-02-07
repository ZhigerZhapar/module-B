    // tokenRoutes.js
    import express from 'express';
    import * as tokenController from '../controllers/tokenController.js';

    const router = express.Router();

    // Маршрут для создания токена
    router.post('/create-token/:workspace_id', tokenController.createToken);

    // Маршрут для отзыва токена
    router.post('/revoke-token/:token_id', tokenController.revokeToken);

    router.get('/tokens-view/:workspace_id', tokenController.getAllTokensForWorkspace);

    export default router;
