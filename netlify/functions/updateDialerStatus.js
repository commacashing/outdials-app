const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }
  
  console.log('Received body:', event.body);
  
  const { 
    rep_phone,
    contact_phone,
    event_type, 
    contact_name, 
    contact_id,
    contact_company,
    contact_region,
    contact_team,
    licenses,
    years_at_firm,
    details, 
    session_id,
    batch_id,
    call_sid,        
    all_call_sids    
  } = JSON.parse(event.body);
  
  console.log('Inserting:', { rep_phone, event_type, session_id });
  
  const { error } = await supabase.from('dialer_status').insert({
    rep_phone,
    contact_phone,
    event_type,
    contact_name,
    contact_id,
    contact_company,
    contact_region,
    contact_team,
    licenses,
    years_at_firm,
    details,
    session_id,
    batch_id,
    call_sid,
    all_call_sids
  });
  
  if (error) {
    console.error('Supabase error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
  
  return { statusCode: 200, body: JSON.stringify({ success: true }) };
};
