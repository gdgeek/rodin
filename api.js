
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';

const RODIN_API_KEY = '8WfeEwRK864mE1KoLRXs1DohRDtIFruKI5qRNVQgvh75yK2LKFqB9uLju9nJ9OR2'; // 替换为你的实际 API 密钥  
//const fs = require('fs');
//const path = require('path');

/*
// 设置 API 密钥  
const RODIN_API_KEY = '8WfeEwRK864mE1KoLRXs1DohRDtIFruKI5qRNVQgvh75yK2LKFqB9uLju9nJ9OR2'; // 替换为你的实际 API 密钥  

// 设置要上传的图像路径  
const imagePath = path.join(__dirname, 'path/to/your/image.jpg'); // 替换为你的图像路径  

// 创建 FormData 对象  
const FormData = require('form-data');
const form = new FormData();
form.append('images', fs.createReadStream(imagePath));

// 发送 POST 请求  
axios.post('https://hyperhuman.deemos.com/api/v2/rodin', form, {
  headers: {
    ...form.getHeaders(),
    'Authorization': `Bearer ${RODIN_API_KEY}`,
  },
})
  .then(response => {
    console.log('Response:', response.data);
  })
  .catch(error => {
    console.error('Error:', error.response ? error.response.data : error.message);
  });
  */


//import FormData from 'form-data';


export const print = () => {
  console.log('Hello from Rodin!');
};
export const status = async (key) => {

  const data = JSON.stringify({
    "subscription_key": key
  });

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://hyperhuman.deemos.com/api/v2/status',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RODIN_API_KEY}`
    },
    data: data
  };

  const response = await axios.request(config);
  return response;
};
export const prompt = async (prompt) => {
  const form = new FormData();
  form.append('prompt', prompt);
  // form.append('images', fs.createReadStream(imagePath));
  //console.log('Hello from Rodin!');
  const response = await axios.post('https://hyperhuman.deemos.com/api/v2/rodin', form, {
    headers: {
      ...form.getHeaders(),
      'Authorization': `Bearer ${RODIN_API_KEY}`,
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
  status,
  print,
}