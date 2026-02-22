exports.handler = async (event, context) => {
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
    
    const response = await fetch(`${instance_url}/services/oauth2/userinfo`, {  // ← FIXED: Template literal syntax
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Accept': 'application/json'
      }
    });
    
    const data = await response.json();  // ← FIXED: Use .json() instead of .text()
    
    if (!response.ok) {
      return {
        statusCode: 401,
        body: JSON.stringify({ 
          error: 'Session expired',
          details: data 
        })
      };
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)  // ← FIXED: Already JSON
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
