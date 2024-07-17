const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');

const app = express();
const port = 4000; 

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Proxy endpoint
app.post('/addData', async (req, res) => {
  try {
    const response = await fetch('https://webhook.site/8e557238-f783-4897-aff6-23547da25d11', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });
    const responseData = await response.json();
    res.json(responseData);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to add data to webhook.site' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Proxy server listening at http://localhost:${port}`);
});
