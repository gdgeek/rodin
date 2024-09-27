
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
export const test = (res) => {
  const glbData = fs.readFileSync("./robot_model.glb");
  const scene = new THREE.Scene();
  const loader = new GLTFLoader();

  loader.parse(glbData.buffer, '', (gltf) => {
    scene.add(gltf.scene);

    // 计算包围盒
    const box = new THREE.Box3().setFromObject(gltf.scene);
    const size = box.getSize(new THREE.Vector3());

    console.log('Bounding Box Size:', size);
  }, (error) => {
    console.error('Error loading GLB file:', error);
  });
  return "1234";
}
export const md5 = () => {
  const filePath = "./robot_model.glb";
  const hash = crypto.createHash('md5');
  const input = fs.createReadStream(filePath);
  input.on('data', (chunk) => {
    hash.update(chunk);
  });

  input.on('end', () => {
    const md5 = hash.digest('hex');
    console.log(`MD5 of ${filePath}: ${md5}`);
  });

  input.on('error', (error) => {
    console.error('Error reading file:', error);
  });
}
export default {
  test,
  md5
}