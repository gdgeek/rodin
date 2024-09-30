import express from 'express';
// index.js  
import api from './api.js';
import polygen from './polygen.js';
import axios from 'axios';
import cors from 'cors';
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
// 设置根路由  
app.get('/', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  res.send('Hel1222是山山水水 lo,2 Express!' + token);
});
app.get('/status', async (req, res) => {
  try {
    const response = await api.status();
    res.send(response);
  } catch (error) {
    console.error('Error details:', error); // 打印完整的错误信息
    res.status(error.response ? error.response.status : 500).send({
      message: 'Internal Server Error',
      details: error.response ? error.response.data : error.message,
    });
  }
})

app.get('/test', async (req, res) => {
  try {
    const prompt = 'A robot that can walk and talk';
    const response = await axios.post('http://api/v1/ai-rodin', { prompt }, {
      headers: req.headers,
    });
    res.status(response.status).send(response3.data);
  } catch (error) {
    console.error('Error details:', error); // 打印完整的错误信息
    res.status(error.response ? error.response.status : 500).send({
      message: 'Internal Server Error',
      details: error.response ? error.response.data : error.message,
    });
  }
});


app.get('/prompt', async (req, res) => {
  const { prompt } = req.query
  if (!prompt) {
    res.status(400).send('prompt is required');
    return;
  }
  if (prompt.length < 4) {
    res.status(400).send('prompt is too short');
    return
  }
  try {
    const response = await axios.post('http://api/v1/ai-rodin', { prompt }, {
      headers: req.headers,
    });
    const response2 = await api.prompt(prompt);
    const response3 = await axios.put('http://api/v1/ai-rodin/' + response.data.id, { status: response2.data }, {
      headers: req.headers,
    });
    res.status(response.status).send(response3.data);
  } catch (error) {
    console.error('Error details:', error); // 打印完整的错误信息
    res.status(error.response ? error.response.status : 500).send({
      message: 'Internal Server Error',
      details: error.response ? error.response.data : error.message,
    });
  }
});

app.get('/v1/ai-rodin', async (req, res) => {
  try {
    const response = await axios.get('https://api/v1/ai-rodin', {
      headers: req.headers,
    });
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error('Error details:', error); // 打印完整的错误信息
    res.status(error.response ? error.response.status : 500).send({
      message: 'Internal Server Error',
      details: error.response ? error.response.data : error.message,
    });
  }
});
app.get('/status', (req, res) => {
  api.status();
  res.send('Hello, status!');
});
app.get('/polygen', (req, res) => {

  res.send(polygen.md5());
});
/*
Response: {
  message: 'Submitted. Please check progress via /api/v2/status and get download link via /api/v2/download',
  submit_time: '2024-09-27T11:56:44.756Z',
  uuid: 'de6c57a7-75b3-45c3-8ccc-3c5918af81b8',
  jobs: {
    uuids: [
      '3d349242-d3e0-4448-b05d-e285265ca0a2',
      '69cb46db-0690-47c9-b98f-412b322285da',
      '179526dc-5d19-4742-b498-856696012ac0',
      'b4558a96-4512-4fb5-b68e-134077629083',
      '731ebfdd-a29e-4374-9f89-342650c24373'
    ],
    subscription_key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoxLCJqb2JJZHMiOlsiM2QzNDkyNDItZDNlMC00NDQ4LWIwNWQtZTI4NTI2NWNhMGEyIiwiNjljYjQ2ZGItMDY5MC00N2M5LWI5OGYtNDEyYjMyMjI4NWRhIiwiMTc5NTI2ZGMtNWQxOS00NzQyLWI0OTgtODU2Njk2MDEyYWMwIiwiYjQ1NThhOTYtNDUxMi00ZmI1LWI2OGUtMTM0MDc3NjI5MDgzIiwiNzMxZWJmZGQtYTI5ZS00Mzc0LTlmODktMzQyNjUwYzI0MzczIl0sImlhdCI6MTcyNzQzODIwNH0.HU47vE7q39TcQpn8E3ZqSy0wJCln4uzLmQdxnKQ9IKA'
  }
}
  */

// 启动服务器  
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});