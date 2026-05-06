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
        return { statusCode: 200, headers, body: JSON.stringify({ status: 'OK', usage: 'POST with {"question":"your question"}' }) };
    }

    try {
        const body = JSON.parse(event.body);
        const question = body.question || '';

        if (!question) {
            return { statusCode: 400, headers, body: JSON.stringify({ error: 'No question provided' }) };
        }

        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer sk-73b73ac8b0754937ba5b01070dc9bccd'
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    { role: 'system', content: 'You are a helpful AI in Gumite Launcher by Marvic Ranger. Keep responses short and friendly.' },
                    { role: 'user', content: question }
                ],
                max_tokens: 500,
                temperature: 0.7
            })
        });

        const data = await response.json();
        return { statusCode: response.status, headers, body: JSON.stringify(data) };
    } catch (error) {
        return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
    }
};
