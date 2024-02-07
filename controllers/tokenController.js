// tokenController.js
import { db } from '../db.js';
import { v4 as uuidv4 } from 'uuid';
// tokenController.js
export const getAllTokensForWorkspace = async (req, res) => {
    try {
        const workspaceId = req.params.workspace_id;
        const [tokens] = await db.promise().query('SELECT * FROM api_tokens WHERE workspace_id = ? AND revoked = false', [workspaceId]);
        res.header('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.render('tokens', { tokens: tokens, workspace_id: workspaceId });
    } catch (error) {
        console.error('Error fetching tokens:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const createToken = async (req, res) => {
    try {
        const { name } = req.body;
        const workspace_id = req.params.workspace_id;
        console.log('Received Request Body:', req.body);

        const tokenValue = uuidv4();
        await db.promise().query('INSERT INTO api_tokens (name, token_value, workspace_id) VALUES (?, ?, ?)', [name, tokenValue, workspace_id]);

        // Fetch all tokens for the workspace
        const [tokens] = await db.promise().query('SELECT * FROM api_tokens WHERE workspace_id = ? AND revoked = false', [workspace_id]);
        console.log('Tokens after creation:', tokens);

        // Передаем createdTokenName при рендеринге страницы
        res.render('tokens', { tokens: tokens, workspace_id: workspace_id, createdTokenName: name,token:tokenValue });
    } catch (error) {
        console.error('Error creating token:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const revokeToken = async (req, res) => {
    const tokenId = req.params.token_id;

    try {
        // Удаляем токен из базы данных
        await db
            .promise()
            .query('DELETE FROM api_tokens WHERE token_id = ?', [tokenId]);
           
        // После успешного удаления токена, перенаправляем на страницу Dashboard
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Error revoking token:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};