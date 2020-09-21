import fs from 'fs'
import path from 'path'
const dir = path.resolve(__dirname, '.././mocks/data.json')
var obj = JSON.parse(fs.readFileSync(dir, 'utf8'));
 // Check redis before running. Update on change

test('Aegis endpoint tests', async () => {
  try {
      expect(obj).toEqual([ { "method": "GET", "route": "/api/users", "statusCode": 200, "requests": 10 }])
  } catch (error) {
    throw error;
  }

});
