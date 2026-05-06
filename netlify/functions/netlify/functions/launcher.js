const crypto = require('crypto');

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod === 'GET') {
        return { statusCode: 200, headers, body: JSON.stringify({ status: 'OK' }) };
    }

    try {
        const body = JSON.parse(event.body);
        const deviceId = body.device_id || '';
        const adminKey = body.admin_key || '';
        const ADMIN_KEY = 'GumiteLauncher2024SecretKey!!';

        if (!deviceId) {
            return { statusCode: 400, headers, body: JSON.stringify({ error: 'Device ID required' }) };
        }
        if (adminKey !== ADMIN_KEY) {
            return { statusCode: 403, headers, body: JSON.stringify({ error: 'Invalid admin key' }) };
        }

        const hash = crypto.createHash('sha256').update(deviceId + ADMIN_KEY).digest('hex');
        const code = hash.substring(0, 12).toUpperCase();

        return { statusCode: 200, headers, body: JSON.stringify({ code: code }) };
    } catch (error) {
        return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
    }
};
