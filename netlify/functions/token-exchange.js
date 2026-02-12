exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { code, code_verifier, redirect_uri, refresh_token, client_id, company_code } = JSON.parse(event.body);

    // Look up client secret by company code, fallback to default env var
    const secretKey = company_code 
      ? `SALESFORCE_CLIENT_SECRET_${company_code.toUpperCase()}`
      : null;
    
    const clientSecret = (secretKey && process.env[secretKey]) 
      || process.env.SALESFORCE_CLIENT_SECRET;

    // Use client_id sent from frontend (company-specific), fallback to env var
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

    const responseText = await response.text();

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Token exchange failed', details: responseText })
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(JSON.parse(responseText))
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error', message: error.message })
    };
  }
};
