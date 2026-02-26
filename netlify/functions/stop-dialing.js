exports.handler = async (event) => {
    await fetch('https://commacashing.app.n8n.cloud/webhook/stop-dialing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: event.body
    });
    return { statusCode: 200 };
};
