import { IS_DEV } from './util/contants';

function getServerConfig() {
  if (IS_DEV) {
    console.log('当前处于开发模式');
    return {
      port: 3030,
      host: 'localhost',
      secret: 'hello, world!',
      dbUrl: 'mongodb://127.0.0.1:27017/monica',
    };
  } else {
    if (typeof process.env.DB_PASSWORD === 'undefined') throw new Error('检测到空的数据库密码，请检查环境变量 DB_PASSWORD 的值');
    const dbPassword: string = process.env.DB_PASSWORD;
    if (typeof process.env.M_SECRET === 'undefined') throw new Error('检测到空的密匙，请检查环境变量 M_SECRET 的值');
    const secret: string = process.env.M_SECRET;
    return {
      secret,
      port: 3030,
      host: '0.0.0.0',
      dbUrl: `mongodb+srv://monica:${dbPassword}@cluster0-sx0ge.mongodb.net/monica`,
    };
  }
}

export default getServerConfig();
