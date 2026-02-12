exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }
  try {
    const { code, code_verifier, redirect_uri, refresh_token, client_id, company_code } = JSON.parse(event.body);
    
    const secretKey = company_code 
      ? `SALESFORCE_CLIENT_SECRET_${company_code.toUpperCase()}`
      : null;
    
    const clientSecret = (secretKey && process.env[secretKey]) 
      || process.env.SALESFORCE_CLIENT_SECRET;
    
    const clientId = client_id || process.env.SALESFORCE_CLIENT_ID;
    
    if (!clientId || !clientSecret) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: `Server configuration error — missing credentials for company: ${company_code}` })
      };
    }
    
    let tokenParams;
    if (refresh_token) {
      tokenParams = new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refresh_token
      });
    } else {
      if (!code || !code_verifier || !redirect_uri) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Missing required parameters' })
        };
      }
      tokenParams = new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirect_uri,
        code_verifier: code_verifier
      });
    }
    
    const response = await fetch('https://login.salesforce.com/services/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: tokenParams.toString()
    });
    
    const data = await response.json();  // ← FIXED: Use .json() instead of .text()
    
    if (!response.ok) {
      return {
        statusCode: 400,  // ← Return 400 for client errors, not Salesforce's status
        body: JSON.stringify({ error: 'Token exchange failed', details: data })
      };
    }
    
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)  // ← FIXED: Already JSON
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error', message: error.message })
    };
  }
};
