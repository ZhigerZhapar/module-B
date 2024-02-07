    // workspaceController.js
    import { db } from '../db.js';

    export async function createWorkspace(req, res) {
        try {
            const { title, description } = req.body;

            if (typeof title !== 'string' || title.trim() === '') {
                return res.status(400).json({ error: 'Title cannot be empty or invalid' });
            }

            await db.promise().query('INSERT INTO workspaces (title, description) VALUES (?, ?)', [title, description]);

            res.redirect('/update-workspaces');
        } catch (error) {
            console.error('Error creating workspace:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }



    export async function updateWorkspacesList(req, res) {
        try {
            const [workspaces] = await db.promise().query('SELECT * FROM workspaces');
            res.render('dashboard', { workspaces:workspaces });
        } catch (error) {
            console.error('Error updating workspaces list:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }


    export async function deleteWorkspace(req, res) {
        try {
            const { workspace_id } = req.params;

            await db.promise().query('DELETE FROM workspaces WHERE workspace_id = ?', [workspace_id]);

            res.redirect('/update-workspaces');
        } catch (error) {
            console.error('Error deleting workspace:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }



    // Функция для рендеринга страницы редактирования пространства
    export async function editWorkspacePage(req, res) {
        try {
            const { workspace_id } = req.params;
            console.log('Workspace ID:', workspace_id);

            // Получаем данные о пространстве для передачи на страницу редактирования
            const [workspace] = await db.promise().query('SELECT * FROM workspaces WHERE workspace_id = ?', [workspace_id]);

            if (!workspace || workspace.length === 0) {
                // Вместо возвращения JSON-ответа рендерим HTML-страницу с сообщением об ошибке
                return res.render('edit-workspace', { error: 'Workspace not found' });
            }

            res.render('edit-workspace', { workspace:workspace[0]});
        } catch (error) {
            console.error('Error rendering edit workspace page:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    // Функция для обновления пространства
    export async function updateWorkspace(req, res) {
        try {
            const { workspace_id } = req.params;
            const { title, description } = req.body;
            console.log('Updating workspace...');
            console.log('Received Request Body:', req.body);

            // Проверяем, что workspace_id является корректным числовым значением
            if (!workspace_id || !Number.isInteger(Number(workspace_id))) {
                return res.status(400).json({ error: 'Invalid workspace ID' });
            }

            // Проверяем, что title не пустое или невалидное
            if (typeof title !== 'string' || title.trim() === '') {
                return res.status(400).json({ error: 'Title cannot be empty or invalid' });
            }

            // Обновляем пространство в базе данных
            await db.promise().query('UPDATE workspaces SET title = ?, description = ? WHERE workspace_id = ?', [title, description, workspace_id]);

            // Перенаправляем после обновления
            console.log('Redirecting to /update-workspaces');
            res.redirect('/update-workspaces');
        } catch (error) {
            console.error('Error updating workspace:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }