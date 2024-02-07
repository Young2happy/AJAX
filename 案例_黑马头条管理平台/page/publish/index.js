/**
 * 目标1：设置频道下拉菜单
 *  1.1 获取频道列表数据
 *  1.2 展示到下拉菜单中
 */
// 1.1 获取频道列表数据
async function setChannleList() {
  const result = await axios({
    url: '/v1_0/channels'
  })
  // console.log(result)
  const optionStr = result.data.channels.map(item => {
    return `<option value="${item.id}">${item.name}</option>`
  }).join('')
  // 1.2 展示到下拉菜单中 提示信息的属性  禁用，选中，隐藏
  document.querySelector('.form-select').innerHTML = `<option value="" disabled selected hidden>请选择文章频道</option>` + optionStr
}
// 网页运行后，默认调用一次
setChannleList()

/**
 * 目标2：文章封面设置
 *  2.1 准备标签结构和样式
 *  2.2 选择文件并保存在 FormData
 *  2.3 单独上传图片并得到图片 URL 网址
 *  2.4 回显并切换 img 标签展示（隐藏 + 号上传标签）
 */
// 2.2 选择文件并保存在 FormData
document.querySelector('.img-file').addEventListener('change', async e => {
  // 优化1. 只有在选中图片文件时才上传文件并回显
  // 若用户不选择（图片）文件则不做任何改变，即图片不变
  // console.log(e.target.files[0])    //  undefined
  if (e.target.files[0]) {
    const file = e.target.files[0]
    const fd = new FormData()
    fd.append('image', file)
    // 2.3 单独上传图片并得到图片 URL 网址
    const result = await axios({
      url: '/v1_0/upload',
      method: 'post',
      data: fd
    })
    console.log(result)
    // 2.4 回显并切换 img 标签展示
    const imgUrl = result.data.url
    document.querySelector('.rounded').src = imgUrl
    document.querySelector('.rounded').classList.add('show')
    document.querySelector('.place').classList.add('hide')
  }
})
// 优化 点击图片 可以更换
// img 点击 ==》 用 JS 方式触发文件选择元素 click 事件方法
document.querySelector('.rounded').addEventListener('click', () => {
  document.querySelector('.img-file').click();
})

/**
 * 目标3：发布文章保存
 *  3.1 基于 form-serialize 插件收集表单数据对象
 *  3.2 基于 axios 提交到服务器保存
 *  3.3 调用 Alert 警告框反馈结果给用户
 *  3.4 重置表单并跳转到列表页
 */

// 发布按钮点击事件
document.querySelector('.send').addEventListener('click', async (e) => {
  // 3.1 基于 form-serialize 插件收集表单数据对象
  const form = document.querySelector('.art-form');
  const data = serialize(form, { hash: true, empty: true })
  console.log(data)
  // 发布文章的时候，不需要 id 属性，所以可以删除掉（id 为了后续编辑）
  delete data.id
  // 自己收集 封面图片地址 并保存到 data 对象中
  data.cover = {
    type: 1, //封面类型
    images: [document.querySelector('.rounded').src]
  }
  // 3.2 基于 axios 提交到服务器
  try {
    const result = await axios({
      url: '/v1_0/mp/articles',
      method: 'POST',
      // Header 之前在 request.js 请求拦截器中 统一写过
      data
    })
    // 3.3 调用 Alert 警告框反馈结果
    myAlert(1, '发布成功')

    // 3.4 重置表单 并跳转到列表页
    form.reset()
    // 封面手动重置
    document.querySelector('.rounded').src = ''
    document.querySelector('.rounded').classList.remove('show')
    document.querySelector('.place').classList.remove('hide')
    // 富文本重置
    editor.setHtml('')

    setTimeout(() => {
      location.href = '../content/index.html'
    }, 1500)

  } catch (error) {
    myAlert(0, error.response.data.message)
    
  }
})

  /**
   * 目标4：编辑-回显文章
   *  4.1 页面跳转传参（URL 查询参数方式）在page/index.js 最后部分实现
   *  4.2 发布文章页面接收参数判断（共用同一套表单）
   *  4.3 修改标题和按钮文字
   *  4.4 获取文章详情数据并回显表单
   */
  // 4.2 发布文章页面接收参数判断（共用同一套表单）
  ~function () {
    // console.log(location.search)
    const paramsStr = location.search
    const params = new URLSearchParams(paramsStr)
    params.forEach((value, key) => {
      // 判断URL中是否有id参数 若有，则是编辑
      if (key === 'id') {
        // 4.3 修改标题和按钮文字
        document.querySelector('.title span').innerHTML = '编辑文章'
        document.querySelector('.send').innerHTML = '修改'
        // 
        axios({
          url: `/v1_0/mp/articles/${value}`,
        }).then(result => {
          console.log(result)
          // 组织需要的数据对象，为后续遍历回显数据准备
          const dataObj = {
            channel_id: result.data.channel_id,
            title: result.data.title,
            rounded: result.data.cover.images[0],  // 封面图片
            content: result.data.content,
            id: result.data.id
          }
          // 遍历数据对象属性，映射到页面元素上，快速赋值
          Object.keys(dataObj).forEach(key => {
            if (key === 'rounded') {
              // 封面设置
              if (dataObj[key]) {
                // 有封面
                document.querySelector('.rounded').src = dataObj[key]
                document.querySelector('.rounded').classList.add('show')
                document.querySelector('.place').classList.add('hide')
              }
            } else if (key === 'content') {
              // 富文本内容
              editor.setHtml(dataObj[key])
            } else {
              // 用数据对象属性名，作为标签 name 属性选择器的值来寻找标签
              document.querySelector(`[name=${key}]`).value = dataObj[key]
            }
          })

        })
      }
    })
  }()
/**
 * 目标5：编辑-保存文章
 *  5.1 判断按钮文字，区分业务（因为共用一套表单）
 *  5.2 调用编辑文章接口，保存信息到服务器
 *  5.3 基于 Alert 反馈结果消息给用户
 */
document.querySelector('.send').addEventListener('click', async e => {
  if (e.target.innerHTML !== "修改")return
  const form = document.querySelector('.art-form')
  const data = serialize(form, { hash: true, empty: true })
  // console.log(data)
  // 5.2 
  try {
    const result = await axios({
      url: `/v1_0/mp/articles/${data.id}`,
      method: 'put',
      data: {
        ...data,
        cover: {
          type: document.querySelector('.rounded').src ? 1 : 0,
          images: [document.querySelector('.rounded').src]
        }
      }
    })
    console.log(result)
    myAlert(true,'修改文章成功')
  }catch(error){
    myAlert(false,error.response.data.message)
  }
})