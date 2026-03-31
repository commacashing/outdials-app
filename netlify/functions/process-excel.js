const ExcelJS = require('exceljs');
exports.handler = async (event) => {
  try {
    const secret = event.headers['x-webhook-secret'];
    if (secret !== process.env.N8N_WEBHOOK_SECRET) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Unauthorized' })
      };
    }
    if (!event.body) throw new Error("No data received");
    
    const { file_base64, enriched_results } = JSON.parse(event.body);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(Buffer.from(file_base64, 'base64'));
    
    console.log('Available sheets:', workbook.worksheets.map(s => s.name));
    
    const worksheet = workbook.worksheets[0];
    if (!worksheet) throw new Error("No worksheets found in workbook");
    const dataMap = {};
    enriched_results.forEach(item => {
      if (item.CRD) dataMap[String(item.CRD).trim()] = item;
    });
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      const cellValue = row.getCell(1).value;
      const crd = cellValue ? String(cellValue).trim() : '';
      
      const enriched = dataMap[crd];
      if (enriched) {
        if (enriched.final_phone) row.getCell(15).value = enriched.final_phone;
        if (enriched.final_email) row.getCell(16).value = enriched.final_email;
        row.getCell(17).value = enriched['C-Score'] !== undefined ? enriched['C-Score'] : 0;
        if (enriched['Brokercheck Link']) {
          const brokercheckUrl = enriched['Brokercheck Link'].trim();
          row.getCell(18).value = {
            text: brokercheckUrl,
            hyperlink: brokercheckUrl
          };
          row.getCell(18).font = { color: { argb: 'FF0000FF' }, underline: true };
        }
        row.commit();
      }
    });
    const outputBuffer = await workbook.xlsx.writeBuffer();
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        file_base64: outputBuffer.toString('base64')
      })
    };
  } catch (err) {
    console.error("Error processing Excel:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
