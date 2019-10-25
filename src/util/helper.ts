export function getIsDevelopment() {
  if (process.env.NODE_ENV === 'development')console.log('当前处于开发模式');
  return process.env.NODE_ENV === 'development';
}
