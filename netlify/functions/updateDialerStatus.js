const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://ceuiturkokdytamvjcet.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNldWl0dXJrb2tkeXRhbXZqY2V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4ODg2ODYsImV4cCI6MjA4MjQ2NDY4Nn0.mXyNlwwRldt-k4iTzUWxPsXkfRJ0uZo4WxJk-buCaHo'
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
    session_id 
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
    session_id
  });
  
  if (error) {
    console.error('Supabase error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
  
  return { statusCode: 200, body: JSON.stringify({ success: true }) };
};
