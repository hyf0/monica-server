export function getIsDevelopment() {
  console.log('当前处于开发模式');
  return process.env.NODE_ENV === 'development';
}
