export function stringAvatar(name) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return {
    children: initials,
    sx: {
      bgcolor: '#f8d7da',
      color: '#721c24',
      width: 100,
      height: 100,
      fontWeight: 'bold',
      fontSize: 32,
      fontFamily: "'Nunito', Helvetica, sans-serif"
    }
  };
}
