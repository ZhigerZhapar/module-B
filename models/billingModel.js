import { db } from '../db.js';
import { importDataFromCSV } from '../importCSV.js';
import * as billingModel from '../models/billingModel.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
// billingModel.js
// Define monthToNumeric function


export const formatTime = (milliseconds) => {
    if (isNaN(milliseconds)) {
        return 'N/A';
    }

    const seconds = milliseconds / 1000;
    return `${seconds.toFixed(3)}`;
};

export const formatCost = (cost) => {
    return cost !== 0 ? (isNaN(cost) ? 'N/A' : `$${cost.toFixed(2)}`) : 'N/A';
};


const monthToNumeric = (month) => {
    const monthsMap = {
        'january': 1,
        'february': 2,
        'march': 3,
        'april': 4,
        'may': 5,
        'june': 6,
        'july': 7,
        'august': 8,
        'september': 9,
        'october': 10,
        'november': 11,
        'december': 12,
    };

    return monthsMap[month.toLowerCase()] || 1;
};
// billingModel.js
// billingModel.js
// billingModel.js
export const getMonthlyBills = async (workspace, month, day) => {
    try {
        const numericMonth = monthToNumeric(month);

        const [billsResult] = await db
            .promise()
            .query(`
                SELECT api_token_name, service_name, 
                       SUM(usage_duration_in_ms) as totalUsage,
                       AVG(service_cost_per_ms) AS serviceCostPerMs
                FROM bills
                WHERE workspace_title = 'My App' 
                    AND MONTH(usage_started_at) = ?
                    AND DAY(usage_started_at) = ?
                GROUP BY api_token_name, service_name
                ORDER BY RAND();
            `, [numericMonth, day]);

            const monthlyBills = billsResult.map(bill => {
                const totalTimeInSeconds = bill.totalUsage / 50 // Перевод в секунды
                const serviceCostPerMs = parseFloat(bill.serviceCostPerMs);
                const totalCost = totalTimeInSeconds * serviceCostPerMs;
            
                console.log('totalCost:', totalCost);  // Добавить эту строку для отладки
            
                return {
                    tokenName: bill.api_token_name,
                    serviceName: bill.service_name,
                    totalTime: formatTime(totalTimeInSeconds),
                    serviceCostPerMs: isNaN(serviceCostPerMs) ? 'N/A' : `$${serviceCostPerMs.toFixed(4)}`,
                    totalCost: isNaN(totalCost) ? 'N/A' : `$${totalCost.toFixed(2)}`,
                };
            });
            
            

        return monthlyBills;
    } catch (error) {
        throw error;
    }
};

export const getBillsByWorkspaceAndDate = async (selectedDate) => {
    try {
        const [result] = await db
        .promise()
        .query(`
            SELECT api_token_name, service_name, usage_duration_in_ms as totalUsageSeconds, service_cost_per_ms
            FROM bills
            WHERE workspace_title = 'My App'
        `, [selectedDate]);
    
        return result;
    } catch (error) {
        throw error;
    }
};