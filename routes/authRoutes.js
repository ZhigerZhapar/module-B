// authRoutes.js
import express from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db.js';

const router = express.Router();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const [user] = await db.promise().query('SELECT * FROM users WHERE username = ?', [username]);

        if (user.length === 1 && bcrypt.compareSync(password, user[0].password)) {
            // Учетные данные действительны, устанавливаем 'userData' в сессии
            req.session.userData = {
                username: username,
                // Другие данные пользователя, которые вы хотите сохранить
            };

            // Перенаправляем на страницу панели управления (dashboard)
            res.redirect('/dashboard');
        } else {
            res.status(401).send('Неверное имя пользователя или пароль');
        }
    } catch (error) {
        console.error('Ошибка входа:', error);
        res.status(500).send('Внутренняя ошибка сервера');
    }
});

export default router;
