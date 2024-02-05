/**
 * 目标1：完成省市区下拉列表切换
 *  1.1 设置省份下拉菜单数据
 *  1.2 切换省份，设置城市下拉菜单数据，清空地区下拉菜单
 *  1.3 切换城市，设置地区下拉菜单数据
 */

// 1.1 设置省份下拉菜单数据
axios({
  url: 'http://hmajax.itheima.net/api/province'
}).then(result => {
  const strProvince = result.data.list.map(pname => {
    return `<option value="${pname}">${pname}</option>`
  }).join('')
  document.querySelector('.province').innerHTML = `<option value="">省份</option>` + strProvince
})

// 1.2 切换省份，设置城市下拉菜单，清空地区下拉菜单
document.querySelector('.province').addEventListener('change', async (e) => {
  const pname = e.target.value
  const result = await axios({
    url: 'http://hmajax.itheima.net/api/city',
    params: {
      pname
    }
  })
  // console.log(result)
  const strCity = result.data.list.map(cname => {
    return `<option value=${cname}>${cname}</option>`
  }).join('')
  document.querySelector('.city').innerHTML = `<option value="">城市</option>` + strCity

  // 清空地区下拉菜单
  document.querySelector('.area').innerHTML = `<option value="">地区</option>`
})

// 1.3 切换城市，设置地区下拉菜单
document.querySelector('.city').addEventListener('change', async (e) => {
  const cname = e.target.value
  const result = axios({
    url: 'http://hmajax.itheima.net/api/area',
    params: {
      pname: document.querySelector('.province').value,
      cname
    }
  })
  // console.log(result)
  const strArea = result.data.list.map(aname => {
    return `<option value=${aname}>${aname}</option>`
  }).join('')
  document.querySelector('.area').innerHTML = `<option value="">地区</option>` + strArea
})

/**
 * 目标2：收集数据提交保存
 *  2.1 监听提交的点击事件
 *  2.2 依靠插件收集表单数据
 *  2.3 基于axios提交保存，显示结果
 */

// 2.1 监听提交的点击事件
document.querySelector('.submit').addEventListener('click', async () => {
  // 2.2 依靠插件收集表单数据
  const form = document.querySelector('.info-form')
  const valueObj = serialize(form, { hash: true, empty: true })
  // console.log(valueList)

  // 2.3 基于axios提交保存
  try {
    const result = await axios({
      url: 'http://hmajax.itheima.net/api/feedback',
      method: 'post',
      data: valueObj
    })
    alert(result.data.message)
  }catch(error){
    alert(error.response.data.message)
  }
})