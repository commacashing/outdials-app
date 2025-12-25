exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { code, code_verifier, redirect_uri } = JSON.parse(event.body);

    if (!code || !code_verifier || !redirect_uri) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required parameters' })
      };
    }

    const tokenParams = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      client_id: '3MVG9HtWXcDGV.nHzF1EzyN.bUajy5rX.YWM11RQGgy_mRqB4oxWWkvtCN2eh5gRZPENJUZjaKqyyDUo0kfvR',
      redirect_uri: redirect_uri,
      code_verifier: code_verifier
    });

    console.log('Making token request to Salesforce...');

    const response = await fetch('https://login.salesforce.com/services/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: tokenParams.toString()
    });

    const responseText = await response.text();
    console.log('Salesforce response status:', response.status);
    console.log('Salesforce response:', responseText);

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ 
          error: 'Token exchange failed',
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
    console.error('Token exchange error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      })
    };
  }
};
