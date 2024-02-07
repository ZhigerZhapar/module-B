// billController.js
import * as billingModel from '../models/billingModel.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// billController.js
export const renderBillsPage = async (req, res) => {
    const workspaceId = req.params.workspace_id;

    try {
        // Extract the selected date from the request query
        const selectedDate = req.query.date || '2023-07-01';

        // Fetch bills data for the workspace and selected date
        const billsData = await billingModel.getBillsByWorkspaceAndDate(workspaceId, selectedDate);

        res.render('bills', { workspaceId, selectedDate, bills: billsData });
    } catch (error) {
        console.error('Error rendering bills page:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


export const viewMonthlyBill = async (req, res) => {
    const workspaceId = req.params.workspace_id;
    const month = req.params.month;

    try {
        // Получаем день из параметра запроса, удостоверьтесь, что он корректный
        const day = req.query.day || 1;  // Временно установлено значение 1, замените его на выбранный день
                    
        const monthlyBillsData = await billingModel.getMonthlyBills(workspaceId, month, day);
        console.log('Monthly Bills Data:', monthlyBillsData);
        res.render('monthlyBill', { workspaceId,selectedDate:day, month:month, bills: monthlyBillsData });
    } catch (error) {
        console.error(`Ошибка при отображении страницы счета за ${month}:`, error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
};

