
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
export const status = () => {

  const data = JSON.stringify({
    "subscription_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoxLCJqb2JJZHMiOlsiNTAyMTBmMWQtOTFhOS00MmIxLTlhNWQtZmU3ZGYyNjJjYTA5IiwiN2UyOTY2NGUtMzgxZC00YTc3LWE0ODAtYzg4NWNjYTcyMjkxIiwiZTAxZTQ3MDctMDAyNC00NThmLWFiMjMtYjZmYTA0ZjAwZWJlIiwiNTg2ODE4YjgtNDFhMi00ZjM4LWI4ZmUtZDdiZDk1YzRjOWJmIiwiZGRkNjJlZmMtZWMwOS00OGFiLWJjMDItMzhlNzFiYzRlOGY2Il0sImlhdCI6MTcyNzQzODU3Nn0.iWOYkAiqtd9Zqchv4BZDXK_T59L3-F_EOePgZGeHzu4"
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

  axios.request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });

};
export const rodin = () => {
  const form = new FormData();
  form.append('prompt', "cool robot");
  // form.append('images', fs.createReadStream(imagePath));
  console.log('Hello from Rodin!');
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
};
// module1.js  
export const greeting = () => {
  return "Hello from Module 1!";
};
export default {
  rodin,
  status,
  print,
}