// billingController.js
import * as billingModel from '../models/billingQuotaModel.js';

export const getBillingQuotasByWorkspaceIdController = async (req, res) => {
    const workspaceId = req.params.workspace_id;

    try {
        const billingQuotas = await billingModel.getBillingQuotasByWorkspaceId(workspaceId);
        res.status(200).json({ billingQuotas });
    } catch (error) {
        console.error('Error fetching billing quotas:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


export const setBillingQuotaController = async (req, res) => {
    try {
        const workspaceId = req.body.workspace_id;

        // Проверьте, что workspaceId не является undefined или null
        if (!workspaceId) {
            return res.status(400).json({ error: 'Workspace ID is required.' });
        }

        const limitInDollars = req.body.limit_in_dollars;

        // Вызывайте функцию установки квоты
        await billingModel.setBillingQuota(workspaceId, limitInDollars);

        // После успешной установки квоты, перенаправляем на страницу Dashboard
        res.redirect(`/dashboard`);
    } catch (error) {
        console.error('Error setting billing quota:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


// billingController.js

export const deleteBillingQuotaController = async (req, res) => {
    try {
        const workspaceId = req.params.workspace_id;

        // Вызывайте функцию удаления квоты
        await billingModel.deleteBillingQuota(workspaceId);

        // После успешного удаления квоты, перенаправляем на страницу Dashboard
        res.redirect(`/dashboard`);
    } catch (error) {
        console.error('Error deleting billing quota:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



// billingController.js

export const renderBillingQuotasPage = async (req, res) => {
    const workspaceId = req.params.workspace_id;

    try {
        const billingQuotas = await billingModel.getBillingQuotasByWorkspaceId(workspaceId);

        res.render('billingQuotas', { workspaceId, billingQuotas});
    } catch (error) {
        console.error('Error rendering billing quotas page:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


