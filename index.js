import express from 'express';
import configure from './configure.js';
// index.js  
import api from './api.js';
import polygen from './polygen.js';
import axios from 'axios';
import crypto from 'crypto'
import COS from 'cos-nodejs-sdk-v5';
import config from "./configure.js"
import cors from 'cors';
const app = express();
const PORT = process.env.PORT || 3000;

const cos = new COS({
  SecretId: config.cos.secret.id,
  SecretKey: config.cos.secret.key,
});
app.use(cors());

app.get('/file', async (req, res) => {
  const { id } = req.query
  if (!id) {
    res.status(400).send('id is required');
    return;
  }
  try {
    const response = await axios.get('http://' + configure.apiUrl + '/v1/ai-rodin/' + id, {
      headers: req.headers,
    });
    const data = response.data.download;
    const glbFile = data.list.find(item => item.name.endsWith('.glb'));

    if (!glbFile) {
      await axios.put('http://' + configure.apiUrl + '/v1/ai-rodin/' + id, { download: null }, {
        headers: req.headers,
      });
      throw new Error('No file with .glb extension found');
    }
    const url = glbFile.url;

    const rs = await axios.get(url, {
      responseType: 'arraybuffer', // 以二进制形式下载
    });
    if (!rs.data) {
      throw new Error('Downloaded data is undefined');
    }
    const hash = crypto.createHash('md5');
    hash.update(rs.data); // 更新哈希对象
    const md5Hash = hash.digest('hex'); // 计算并返回 MD5 哈希值
    try {
      const key = "/ai/polygen/" + md5Hash + ".glb"
      const buffer = Buffer.from(rs.data);

      cos.putObject(
        {
          Bucket: config.cos.bucket,
          Region: config.cos.region,
          Key: key, // 可选，指定前缀以过滤结果
          Body: buffer, // 可选，标记，表示从哪个位置开始获取
          ContentLength: buffer.length,
        },
        async (err, data) => {
          if (err) {
            throw new Error(err.message);
          } else {
            try {
              const response3 = await axios.post('http://' + configure.apiUrl + '/v1/ai-rodin/file?id=' + id, {
                filename: response.data.generation.prompt + ".glb",
                url: "https://" + data.Location,
                md5: md5Hash,
                key: key,
              }, {
                headers: req.headers,
              })
              res.status(response3.status).send(response3.data);
            } catch (error) {
              console.error('Error details:', error); // 打印完整的错误信息
              res.status(500).send({
                message: 'Internal Server Error',
                details: error.response ? error.response.data : error.message,
              });
            }
          }
        }
      );

    } catch (error) {

      res.send(error.message);
    }


  } catch (error) {
    console.error('Error details:', error); // 打印完整的错误信息
    res.status(error.response ? error.response.status : 500).send({
      message: 'Internal Server Error',
      details: error.response ? error.response.data : error.message,
    });
  }
});
app.get('/download', async (req, res) => {
  const { id } = req.query
  if (!id) {
    res.status(400).send('id is required');
    return;
  }
  try {
    const response = await axios.get('http://' + configure.apiUrl + '/v1/ai-rodin/' + id, {
      headers: req.headers,
    });

    const generation = response.data.generation;

    if (!generation || !generation.uuid) {
      res.status(404).send('Not Found');
      return;
    }
    const response2 = await api.download(generation.uuid);
    const response3 = await axios.put('http://' + configure.apiUrl + '/v1/ai-rodin/' + id, { download: response2.data }, {
      headers: req.headers,
    });
    res.status(response3.status).send(response3.data);

  } catch (error) {
    console.error('Error details:', error); // 打印完整的错误信息
    res.status(error.response ? error.response.status : 500).send({
      message: 'Internal Server Error',
      details: error.response ? error.response.data : error.message,
    });
  }
});
app.get('/check', async (req, res) => {
  const { id } = req.query
  if (!id) {
    res.status(400).send('id is required');
    return;
  }
  try {
    const response = await axios.get('http://' + configure.apiUrl + '/v1/ai-rodin/' + id, {
      headers: req.headers,
    });

    const generation = response.data.generation;

    if (!generation || !generation.jobs || !generation.jobs.subscription_key) {
      res.status(404).send('Not Found');
      return;
    }
    const response2 = await api.check(generation.jobs.subscription_key);

    const response3 = await axios.put('http://' + configure.apiUrl + '/v1/ai-rodin/' + id, { check: response2.data }, {
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
})

const getResource = async (resource_id, req) => {
  const response = await axios.get('http://' + configure.apiUrl + '/v1/resources/' + resource_id, {
    headers: req.headers,
  });

  const file = response.data.file;
  const url = file.url.replace(/^http:\/\//, 'https://');
  const meta = {
    filename: file.filename, // 指定文件名
    contentType: file.type, // 根据文件类型设置适当的 Content-Type
  }
  const response2 = await axios.get(url, {
    responseType: 'arraybuffer', // 以二进制形式下载
  });
  // 确保下载的数据有效
  if (!response2.data) {
    throw new Error('Downloaded data is undefined');
  }
  return { data: response2.data, meta: meta };
}
app.get('/rodin', async (req, res) => {
  let { resource_id, prompt, id } = req.query

  try {
    if (id) {
      const response = await axios.get('http://' + configure.apiUrl + '/v1/ai-rodin/' + id, {
        headers: req.headers,
      });
      resource_id = response.data.query?.resource_id
      prompt = response.data.query?.prompt

      if (!prompt && !resource_id) {
        res.status(400).send('prompt or resource_id is required');
        return;
      }
    } else {

      if (!prompt && !resource_id) {
        res.status(400).send('prompt or resource_id is required');
        return;
      }
      const response = await axios.post('http://' + configure.apiUrl + '/v1/ai-rodin', { query: req.query, name: prompt }, {
        headers: req.headers,
      });
      id = response.data.id;
    };
    const images = []
    if (resource_id) {
      if (Array.isArray(resource_id)) {
        resource_id.forEach(async (id) => {
          const data = await getResource(id, req)
          images.push(data)
        })
      } else {
        const data = await getResource(resource_id, req)
        images.push(data)
      }
    }
    const response2 = await api.rodin(images, prompt);
    const response3 = await axios.put('http://' + configure.apiUrl + '/v1/ai-rodin/' + id, { generation: response2.data, name: response2.data.prompt }, {
      headers: req.headers,
    });
    res.status(response3.status).send(response3.data);

  } catch (error) {
    console.error('Error details:', error); // 打印完整的错误信息
    res.status(error.response ? error.response.status : 500).send({
      message: 'Internal Server Error',
      details: error.response ? error.response.data : error.message,
    });

  }
});

// 启动服务器  
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});