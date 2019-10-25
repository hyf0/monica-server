export function getIsDevelopment() {
  if (process.env.NODE_ENV === 'production') return true;
  return process.env.NODE_ENV === 'development';
}
