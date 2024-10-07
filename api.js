
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import configure from './configure.js';
import { PassThrough } from 'stream';
//const RODIN_API_KEY = configure.rodin.apiKey; // 替换为你的实际 API 密钥  



const download = async (uuid) => {

  const data = JSON.stringify({
    "task_uuid": uuid
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://hyperhuman.deemos.com/api/v2/download',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${configure.rodin.apiKey}`
    },
    data: data
  };

  return await axios.request(config);
};

const check = async (key) => {

  const data = JSON.stringify({
    "subscription_key": key
  });

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://hyperhuman.deemos.com/api/v2/status',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${configure.rodin.apiKey}`
    },
    data: data
  };

  return await axios.request(config);
};
const rodin = async (images, prompt, quality) => {
  const data = new FormData();
  if ((!images || images.length == 0) && !prompt) {
    throw new Error('Images and prompt are required');
  }
  images.forEach((image) => {
    data.append('images', (new PassThrough()).end(image.data), image.meta);
  });
  if (quality) {
    data.append('quality', quality);
  }

  if (prompt) {
    data.append('prompt', prompt);
  }


  const response = await axios.post('https://hyperhuman.deemos.com/api/v2/rodin', data, {
    headers: {
      ...data.getHeaders(),
      'Authorization': `Bearer ${configure.rodin.apiKey}`,
    },
  });

  return response;
}
const prompt = async (prompt) => {
  const form = new FormData();
  form.append('prompt', prompt);
  // form.append('images', fs.createReadStream(imagePath));
  //console.log('Hello from Rodin!');
  const response = await axios.post('https://hyperhuman.deemos.com/api/v2/rodin', form, {
    headers: {
      ...form.getHeaders(),
      'Authorization': `Bearer ${configure.rodin.apiKey}`,
    },
  });
  return response;
};
// module1.js  
export const greeting = () => {
  return "Hello from Module 1!";
};
export default {
  prompt,
  check,
  download,
  rodin
}