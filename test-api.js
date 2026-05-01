const http = require('http');

const url = 'http://localhost:3000/api/teachers?class=69f3d0794479c6dc8e57fb8b&section=69f3d07a4479c6dc8e57fb8f&subject=69f3d07a4479c6dc8e57fb96';

http.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    try {
      const j = JSON.parse(data);
      console.log('Teachers found:', j.length);
      j.forEach(t => console.log(' -', t.name));
    } catch (e) {
      console.log('Parse error:', e.message);
      console.log('Raw data:', data.substring(0, 200));
    }
  });
}).on('error', (e) => {
  console.error('Request error:', e.message);
});