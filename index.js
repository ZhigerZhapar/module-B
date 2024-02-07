import express from 'express';
import path from 'path';
import cors from 'cors';
import session from 'express-session';
import authRoutes from './routes/authRoutes.js';
import workspacesRoutes from './routes/workspaceRoutes.js';
import tokenRoutes from './routes/tokenRoutes.js';
import * as workspaceController from './controllers/workspaceController.js';
import billRoutes from './routes/billRoutes.js';
import billingQuotaRoutes from './routes/billingRoutes.js';
import { fileURLToPath } from 'url';
import * as billingModel from './models/billingModel.js';
const app = express();
const PORT = 8800;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'myVeryLongAndRandomSecretKey',
    resave: false,
    saveUninitialized: true,
}));








// Статические файлы
const publicPath = path.join(__dirname, 'public');
app.use('/public', express.static(publicPath, { maxAge: '1d' }));

app.get('/', (req, res) => {
    res.render('index');
});

// Страница с токенами
app.get('/dashboard', async (req, res) => {
    try {
        await workspaceController.updateWorkspacesList(req, res);
    } catch (error) {
        console.error('Error rendering dashboard:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Маршруты для авторизации и управления рабочими пространствами
app.use(authRoutes);
app.use('/tokens',tokenRoutes);
app.use('/workspaces', workspacesRoutes);
app.use(workspacesRoutes);
app.use(tokenRoutes);
// Маршруты для квот биллингаssssss
app.use('/billing-quotas', billingQuotaRoutes);
// Получение всех токенов для конкретного рабочего пространства
app.use('/bills', billRoutes);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
