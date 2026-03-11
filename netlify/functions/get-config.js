exports.handler = async () => {
    return {
        statusCode: 200,
        body: JSON.stringify({
            webhookSecret: process.env.N8N_WEBHOOK_SECRET
        })
    };
};
