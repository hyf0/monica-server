// import { isDevelopment } from '../utils';

// export function getServerConfig() {
//   if (isDevelopment()) {
//     return {
//       port: 3031,
//       host: 'localhost',
//       secret: 'hello, world!',
//       dbUrl: 'mongodb://127.0.0.1:27017/monica',
//     };
//   } else {
//     if (typeof process.env.DB_PASSWORD === 'undefined') throw new Error('检测到空的数据库密码，请检查环境变量 DB_PASSWORD 的值');
//     const dbPassword: string = process.env.DB_PASSWORD;
//     return {
//       port: 80,
//       host: '0.0.0.0',
//       secret: 'hello, world!',
//       dbUrl: `mongodb+srv://monica:${dbPassword}@cluster0-sx0ge.mongodb.net/monica`,
//     };
//   }
// }
