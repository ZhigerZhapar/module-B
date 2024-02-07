// db.js
import mysql2 from 'mysql2';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import csv from 'fast-csv';

export const db = mysql2.createPool({
    host: "localhost",
    user: "root",
    password: "Zhigerka1789",
    database: "module",
    connectionLimit: 10
});



// Проверяем, есть ли уже записи в таблице users
const [existingUsers] = await db.promise().query('SELECT * FROM users');

if (existingUsers.length === 0) {
    const salt = bcrypt.genSaltSync(10);
    const hashDemo1 = bcrypt.hashSync('skills2023d1', salt);
    const hashDemo2 = bcrypt.hashSync('skills2023d2', salt);

    await db.promise().query(`
        INSERT INTO users (username, password)
        VALUES ('demo1', ?), ('demo2', ?)
    `, [hashDemo1, hashDemo2]);

    console.log('Тестовые пользователи добавлены');
} else {
    console.log('В таблице users уже есть записи, тестовые пользователи не добавлены');
}






const [existingWorkspaces] = await db.promise().query('SELECT * FROM workspaces');

if (existingWorkspaces.length === 0) {
    // Добавляем тестовые данные для workspaces
    await db.promise().query(`
        INSERT INTO workspaces (title, description)
        VALUES
            ('Workspace 1', 'Description 1'),
            ('Workspace 2', 'Description 2')
    `);

    console.log('Тестовые рабочие пространства добавлены');
} else {
    console.log('В таблице workspaces уже есть записи, тестовые рабочие пространства не добавлены');
}





// Путь к вашему CSV файлу

// Чтение CSV файла и импорт данных в базу данных
fs.createReadStream('C:/Users/Zhiger/Desktop/backend/service_usages.csv')
    .pipe(csv.parse({ headers: true }))
    .on('data', async (data) => {
        // Импорт в таблицу "bills" с соответствующими полями
        await db.promise().query(`
            INSERT INTO bills (username, workspace_title, api_token_name, usage_duration_in_ms, usage_started_at, service_name, service_cost_per_ms)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
            data.username,
            data.workspace_title,
            data.api_token_name,
            data.usage_duration_in_ms,
            data.usage_started_at,
            data.service_name,
            data.service_cost_per_ms
        ]);
    })
    .on('end', () => {
        console.log('Импорт данных завершен');
    })
    .on('error', (error) => {
        console.error('Ошибка при импорте данных:', error.message);
    });
// Подключаем поток CSV к потоку парсера

