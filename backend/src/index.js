const Koa = require('koa');
const router = require('koa-router')();
const fetch = require('node-fetch');
const cors = require('kcors');
const request = require('request-promise-native');

const appId = process.env.APPID || 'ae20e0a09a4c73aa871a96f99007238f';
const mapURI = process.env.MAP_ENDPOINT || 'http://api.openweathermap.org/data/2.5';
const targetCity = process.env.TARGET_CITY || 'Tampere,fi';

const port = process.env.PORT || 9000;

const app = new Koa();

app.use(cors());

const fetchWeather = async (lat, lon) => {

  const endpoint = `${mapURI}/forecast?lat=${lat}&lon=${lon}&appid=${appId}&`;
  //const endpoint = `${mapURI}/forecast?q=${targetCity}&appid=${appId}&`;
  const response = await fetch(endpoint);

  return response ? response.json() : {};
};

router.get('/api/weather', async ctx => {

  //clientIP = '';

  try {
    const geoData = JSON.parse(await request(`http://ip-api.io/json/${ ctx.ip }`));
    //const geoData = JSON.parse(await request(`http://ip-api.io/json/${ clientIP }`));
    ctx.lat = geoData.latitude;
    ctx.lon = geoData.longitude;
  } catch(e) {
    console.log('Error', e);
  }

  const weatherData = await fetchWeather(ctx.lat, ctx.lon);

  ctx.type = 'application/json; charset=utf-8';
  ctx.body = weatherData.list[1].weather ? weatherData.list[1].weather : {};
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(port);

console.log(`App listening on port ${port}`);
