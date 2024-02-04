/**
 * 目标1：默认显示-北京市天气
 *  1.1 获取北京市天气数据
 *  1.2 数据展示到页面
 */

// 获取并渲染天气
function getWeather(city){
    myAxios({
        url:'http://hmajax.itheima.net/api/weather',
        params:{
            city
        }
    }).then(ret=>{
        console.log(ret)
        
        // 左上角 div.title
        const data = ret.data;
        document.querySelector('.title').innerHTML = `
        <span class="dateShort">${data.dateShort}</span>
        <span class="calendar">农历&nbsp;
          <span class="dateLunar">${data.dateLunar}</span>
        </span>
        `
        // 右上角 城市（区域）
        document.querySelector('.area').innerHTML = data.area;
    })
}
// 进入网页默认获取的天气数据（北京市城市编码：110100）
getWeather('110100')