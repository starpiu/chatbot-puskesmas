const fs = require('fs');
const path = require('path');

export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,HEAD,PUT,PATCH,POST,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Serve index.html for root path
    const filePath = path.join(process.cwd(), 'public', 'index.html');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(fileContent);
  } catch (error) {
    console.error('Error serving homepage:', error);
    res.status(500).json({ error: 'Failed to serve homepage' });
  }
}
