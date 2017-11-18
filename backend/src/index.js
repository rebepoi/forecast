const Koa = require('koa');
const router = require('koa-router')();
const fetch = require('node-fetch');
const cors = require('kcors');
const where = require('node-where');

const appId = process.env.APPID || 'ae20e0a09a4c73aa871a96f99007238f';
const mapURI = process.env.MAP_ENDPOINT || 'http://api.openweathermap.org/data/2.5';
const targetCity = process.env.TARGET_CITY || 'Tampere,fi';

var lat, lon, ip;

const port = process.env.PORT || 9000;

const app = new Koa();

app.use(cors());

where.is(ip, function(err, result) {
  if (result) {
    lat = result.get('lat');
    lon = result.get('lng');
  } else {
    console.error(err);
  }
});

const fetchWeather = async () => {
  console.log(ip);
  const endpoint = `${mapURI}/forecast?lat=${lat}&lon=${lon}&appid=${appId}&`;
  //const endpoint = `${mapURI}/forecast?q=${targetCity}&appid=${appId}&`;
  const response = await fetch(endpoint);

  return response ? response.json() : {};
};

router.get('/api/weather', async ctx => {
  ip = ctx.ip;
  const weatherData = await fetchWeather();

  ctx.type = 'application/json; charset=utf-8';
  ctx.body = weatherData.list.weather ? weatherData.list[1].weather[0] : {};
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(port);

console.log(`App listening on port ${port}`);
