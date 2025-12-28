const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://ceuiturkokdytamvjcet.supabase.co',
  'sb_publishable_BLhQiKAo7KtgxrxyFSaBtw_0yc8Vy8L'
);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const { rep_phone, event_type, contact_name, details } = JSON.parse(event.body);

  const { error } = await supabase.from('dialer_status').insert({
    rep_phone,
    event_type,
    contact_name,
    details
  });

  if (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }

  return { statusCode: 200, body: JSON.stringify({ success: true }) };
};
