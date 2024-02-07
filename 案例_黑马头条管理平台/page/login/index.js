/**
 * 目标1：验证码登录
 * 1.1 在 utils/request.js 配置 axios 请求基地址
 * 1.2 收集手机号和验证码数据
 * 1.3 基于 axios 调用验证码登录接口
 * 1.4 使用 Bootstrap 的 Alert 警告框反馈结果给用户
 */

// 按钮点击事件
document.querySelector('.btn').addEventListener('click', async () => {
  // 1.2 使用form-serialize 插件获取表单 值
  const form = document.querySelector('.login-form')
  const data = serialize(form, { hash: true, empty: true })
  // console.log(data)

  // 1.3 基于 axios 调用验证码登录接口
  try {
    const result = await axios({
      url: '/v1_0/authorizations',
      method: 'post',
      data
    })
    console.log(result)
    // 1.4 使用 Bootstrap 的 Alert 警告框反馈结果给用户
    result.data.message = '登陆成功'
    myAlert(true, result.data.message)

    // 登录成功后，保存 token 令牌字符串到本地，并跳转到内容列表页面
    localStorage.setItem('token',result.data.token)
    // 延迟登录，能看到提示框
    setTimeout(()=>{
      location.href = '../content/index.html'
    },1800)
    
  } catch (error) {
    console.dir(error)
    myAlert(false,error.response.data.message)
  }
})
