exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Return Supabase credentials securely
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'https://fabulous-hamster-abc51c.netlify.app'
    },
    body: JSON.stringify({
      url: process.env.SUPABASE_URL,
      key: process.env.SUPABASE_ANON_KEY
    })
  };
};
