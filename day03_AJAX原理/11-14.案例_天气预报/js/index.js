/**
 * 目标1：默认显示-北京市天气
 *  1.1 获取北京市天气数据
 *  1.2 数据展示到页面
 */

// 获取并渲染天气  静态
function getWeather(city) {
  myAxios({
    url: 'http://hmajax.itheima.net/api/weather',
    params: {
      city
    }
  }).then(ret => {
    console.log(ret)
    // 获取天气数据
    const data = ret.data;

    // 用获取到数据渲染界面

    // 左上角 div.title
    document.querySelector('.title').innerHTML = `
        <span class="dateShort">${data.dateShort}</span>
        <span class="calendar">农历&nbsp;
          <span class="dateLunar">${data.dateLunar}</span>
        </span>
        `
    // 右上角 城市（区域）
    document.querySelector('.area').innerHTML = data.area;

    // weather-box
    document.querySelector('.weather-box').innerHTML = `
        <div class="tem-box">
        <span class="temp">
          <span class="temperature">${data.temperature}</span>
          <span>°</span>
        </span>
      </div>
      <div class="climate-box">
        <div class="air">
          <span class="psPm25">${data.psPm25}</span>
          <span class="psPm25Level">${data.psPm25Level}</span>
        </div>
        <ul class="weather-list">
          <li>
            <img src=${data.weatherImg} class="weatherImg" alt="">
            <span class="weather">${data.weather}</span>
          </li>
          <li class="windDirection">${data.windDirection}</li>
          <li class="windPower">${data.windPower}</li>
        </ul>
      </div>
        `
    // today-weather
    const tdWeather = data.todayWeather;
    document.querySelector('.today-weather').innerHTML = `
        <div class="range-box">
        <span>今天：</span>
        <span class="range">
          <span class="weather">${tdWeather.weather}</span>
          <span class="temNight">${tdWeather.temNight}</span>
          <span>-</span>
          <span class="temDay">${tdWeather.temDay}</span>
          <span>℃</span>
        </span>
      </div>
      <ul class="sun-list">
        <li>
          <span>紫外线</span>
          <span class="ultraviolet">${tdWeather.ultraviolet}</span>
        </li>
        <li>
          <span>湿度</span>
          <span class="humidity">${tdWeather.humidity}</span>%
        </li>
        <li>
          <span>日出</span>
          <span class="sunriseTime">${tdWeather.sunriseTime}</span>
        </li>
        <li>
          <span>日落</span>
          <span class="sunsetTime">${tdWeather.sunsetTime}</span>
        </li>
      </ul>
        `
    // 7日天气预报 forecast
    const forecast = data.dayForecast;
    const forecastList = forecast.map(item => {
      return `<li class="item">
                    <div class="date-box">
                    <span class="dateFormat">${item.dateFormat}</span>
                    <span class="date">${item.date}</span>
                </div>
                <img src=${item.weatherImg} alt="" class="weatherImg">
                <span class="weather">${item.weather}</span>
                <div class="temp">
                    <span class="temNight">${item.temNight}</span>-
                    <span class="temDay">${item.temDay}</span>
                    <span>℃</span>
                </div>
                <div class="wind">
                    <span class="windDirection">${item.windDirection}</span>
                    <span class="windPower">${item.windPower}</span>
                </div>
                </li>`
    }).join('')
    // console.log(forecastList)
    document.querySelector('.week-wrap').innerHTML = forecastList;
  })
}
// 进入网页默认获取的天气数据（北京市城市编码：110100）
getWeather('110100')

/**
 * 目标2：搜索城市列表
 *  2.1 绑定 input 事件，获取关键字
 *  2.2 获取展示城市列表数据
 */

// value 值改变，触发 input 事件
document.querySelector('.search-city').addEventListener('input', (e) => {
  console.log(e)
  // console.log(e.data) 等同于下面一行
  // console.log(e.target.value)

  // 将获取的 value 值 提交到服务器，并返回结果
  myAxios({
    url: 'http://hmajax.itheima.net/api/weather/city',
    method: 'get',
    params: {
      city: e.data
    }
  }).then(result => {
    console.log(result)
    // 对结果处理，获取展示的搜索列表
    const searchList = result.data.map(item => {
      // 自定义属性 data-code，以便下面动态渲染时，准确获取 城市编码
      return `<li class="city-item" data-code=${item.code}>${item.name}</li>`
    }).join('')
    document.querySelector('.search-list').innerHTML = searchList;
  })
})

/**
     *  目标3：动态渲染页面
     *   3.1 点击事件，获取对应的 cityCode值
     *   3.2 渲染页面
     */

// 利用事件委托， 来确定点的哪个li。    不用为每个 li 绑定事件
document.querySelector('.search-list').addEventListener('click',e=>{
  // 只有点击 li 标签
  console.log(e)
  if(e.target.classList.contains('city-item')){
    // 利用自定义属性 data-code 获取 cityCode
    // 获取 cityCode值
    const cityCode = e.target.dataset.code;
    getWeather(cityCode)
  };
})