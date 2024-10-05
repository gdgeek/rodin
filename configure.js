
import getenv from 'getenv';

export default {
  apiUrl: getenv.string('API_URL'),
  rodin: {
    apiKey: getenv.string('RODIN_API_KEY'),
  },
  cos: {
    secret: {
      id: getenv('COS_SECRET_ID'),
      key: getenv('COS_SECRET_KEY')
    },
    bucket: getenv('COS_BUCKET'),
    region: getenv('COS_REGION')
  }
}
