exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { access_token, instance_url } = JSON.parse(event.body);

    if (!access_token || !instance_url) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing access_token or instance_url' })
      };
    }

    console.log('Fetching user info from:', `${instance_url}/services/oauth2/userinfo`);

    const response = await fetch(`${instance_url}/services/oauth2/userinfo`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Accept': 'application/json'
      }
    });

    const responseText = await response.text();
    console.log('User info response status:', response.status);
    console.log('User info response:', responseText);

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ 
          error: 'Failed to fetch user info',
          details: responseText 
        })
      };
    }

    const data = JSON.parse(responseText);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };

  } catch (error) {
    console.error('User info error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      })
    };
  }
};
