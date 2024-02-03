/**
 * 目标1：信息渲染
 *  1.1 获取用户的数据
 *  1.2 回显数据到标签上
 * */
const creator = '波仔'
// 1.1 获取用户信息
axios({
  url: "http://hmajax.itheima.net/api/settings",
  method: 'get',
  params: {
    creator
  }
}).then(result => {
  // 1.2 回显数据到各自标签上
  console.log(result)
  const userObj = result.data.data
  console.log(userObj)
  Object.keys(userObj).forEach(key => {
    // console.log(key)
    if (key === 'avatar') {
      // 赋予默认头像
      document.querySelector('.prew').src = userObj[key]
    } else if (key === 'gender') {
      // 赋予默认性别
      // 获取性别单选框 
      const gRadioList = document.querySelectorAll('.gender');
      // console.log(gRadioList)
      // gender值： 0=》男 1=》女
      const gNum = userObj[key]
      gRadioList[gNum].checked = true;

    } else {
      // 赋予默认信息
      document.querySelector(`.${key}`).value = userObj[key]
    }
  })
})

/*  
 *  目标2：修改头像
 *   2.1 获取头像文件
 *   2.2 提交服务器并更新头像 
 *  */

// 更换头像文件 =》 change 事件
document.querySelector('.upload').addEventListener('change', e => {
  // 2.1 获取头像元素
  // console.log(e.target.files[0]);
  const fd = new FormData()
  fd.append('avatar', e.target.files[0])
  fd.append('creator', creator)
  // 2.2 提交服务器并更新头像
  axios({
    url: 'http://hmajax.itheima.net/api/avatar',
    method: 'put',
    data: fd
  }).then(result => {
    console.log(result);
    const imgUrl = result.data.data.avatar
    document.querySelector('.prew').src = imgUrl
  })
})

/* 目标3：提交表单
  3.1 收集表单信息
  3.2 提交到服务器保存
*/

// 保存修改 =》 点击提交
document.querySelector('.submit').addEventListener('click', () => {
  // 3.1 利用插件 获取表单值
  const form = document.querySelector('.user-form')
  const valueObj = serialize(form, { hash: true, empty: true })
  // console.log(valueObj)
  // 根据后端接口文档，此处还须增加一个属性 creator
  valueObj.creator = creator;
  // gender 由 string 改为 数字类型
  valueObj.gender = +valueObj.gender;
  console.log(valueObj)

  // 3.2 提交到服务器
  axios({
    url: 'http://hmajax.itheima.net/api/settings',
    method: 'PUT',
    data: valueObj
  }).then(result => {
    console.log(result)
    // 弹出提示信息
    // alert(result.data.message)

  /*  目标4：优化弹窗
      使用 bootstrap 的 toasts 框架 
    */
    const toastDom = document.querySelector('.my-toast')
    const toast = new bootstrap.Toast(toastDom)
    toast.show();
  })
})




