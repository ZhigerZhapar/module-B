// billingQuotaModel.js
import { db } from '../db.js';

export const getBillingQuotasByWorkspaceId = async (workspaceId) => {
    try {
        const [result] = await db
            .promise()
            .query('SELECT * FROM billing_quotas WHERE workspace_id = ?', [workspaceId]);
        return result;
    } catch (error) {
        throw error;
    }
};

export const setBillingQuota = async (workspaceId, limit) => {
    try {
        const existingQuota = await getBillingQuotasByWorkspaceId(workspaceId);

        if (existingQuota.length > 0) {
            await updateBillingQuota(workspaceId, limit);
        } else {
            await createBillingQuota(workspaceId, limit);
        }
    } catch (error) {
        throw error;
    }
};

export const deleteBillingQuota = async (workspaceId) => {
    try {
        await db
            .promise()
            .query('DELETE FROM billing_quotas WHERE workspace_id = ?', [workspaceId]);
    } catch (error) {
        throw error;
    }
};

export const createBillingQuota = async (workspaceId, limit) => {
    try {
        await db
            .promise()
            .query('INSERT INTO billing_quotas (workspace_id, limit_in_dollars) VALUES (?, ?)', [workspaceId, limit]);
    } catch (error) {
        throw error;
    }
};

export const updateBillingQuota = async (workspaceId, limit) => {
    try {
        await db
            .promise()
            .query('UPDATE billing_quotas SET limit_in_dollars = ? WHERE workspace_id = ?', [limit, workspaceId]);
    } catch (error) {
        throw error;
    }
};
