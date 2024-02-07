/**
 * 目标1：获取文章列表并展示
 *  1.1 准备查询参数对象
 *  1.2 获取文章列表数据
 *  1.3 展示到指定的标签结构中
 */
// 1.1 准备查询参数
const queryObj = {
  status: '',
  channel_id: '',
  page: 1,
  per_page: 2
}
// 总条数
let total_count = 0

// 封装函数 获取文章列表数据
async function getArticleList() {
  // 1.2 获取文章列表数据
  const result = await axios({
    url: '/v1_0/mp/articles',
    method: 'get',
    params: queryObj
  })
  console.log(result)
  
  // 1.3 展示到指定的标签结构中
  const data = result.data.results.map(item => `<tr>
  <td>
    <img src=${item.cover.type === 0 ? "https://img2.baidu.com/it/u=2640406343,1419332367&amp;fm=253&amp;fmt=auto&amp;app=138&amp;f=JPEG?w=708&amp;h=500" : `${item.cover.images[0]}`} alt="">
  </td>
  <td>${item.title}</td>
  <td>
    ${(item.status == 1) ? `<span class="badge text-bg-primary">待审核</span>` : `<span class="badge text-bg-success">审核通过</span>`}
  </td>
  <td>
    <span>${item.pubdate}</span>
  </td>
  <td>
    <span>${item.read_count}</span>
  </td>
  <td>
    <span>${item.comment_count}</span>
  </td>
  <td>
    <span>${item.like_count}</span>
  </td>
  <td data-id=${item.id}>
    <i class="bi bi-pencil-square edit"></i>
    <i class="bi bi-trash3 del"></i>
  </td>
</tr>`)
  document.querySelector('.art-list').innerHTML = data.join('')

  // 3.1 保存并设置文章总条数 及 当前页数
  total_count = result.data.total_count
  document.querySelector('.total-count').innerHTML = `共${total_count}条`
  document.querySelector('.page-now').innerHTML = `第${queryObj.page}页`
}
getArticleList()


/**
 * 目标2：筛选文章列表
 *  2.1 设置频道列表数据
 *  2.2 监听筛选条件改变，保存查询信息到查询参数对象
 *  2.3 点击筛选时，传递查询参数对象到服务器
 *  2.4 获取匹配数据，覆盖到页面展示
 */
// 2.1 设置频道列表数据
async function setChannleList() {
  const result = await axios({
    url: '/v1_0/channels'
  })
  const optionStr = result.data.channels.map(item => {
    return `<option value="${item.id}">${item.name}</option>`
  }).join('')
  document.querySelector('.form-select').innerHTML = `<option value="" disabled selected hidden>请选择文章频道</option>` + optionStr
}
setChannleList()
// 2.2 监听筛选条件改变，保存查询信息到查询参数对象
// 筛选状态标记数字=》change事件=》绑定到查询参数对象上
document.querySelectorAll('.form-check-input').forEach(raido=>{
  raido.addEventListener('change',e=>{
    queryObj.status = e.target.value
  })
})
// 筛选频道id=》change事件=》绑定到查询参数对象上
document.querySelector('.form-select').addEventListener('change',e=>{
  // console.log(e.target.value)
  queryObj.channel_id = e.target.value
})
// 2.3 点击筛选时，传递查询参数对象到服务器
document.querySelector('.sel-btn').addEventListener('click',()=>{
  // 有BUG，翻页后筛选，页数问题
  // 重置当前显示页数
  queryObj.page = 1;
  // 2.4 获取匹配数据，覆盖到页面展示
  getArticleList();
})
/**
 * 目标3：分页功能
 *  3.1 保存并设置文章总条数
 *  3.2 点击下一页，做临界值判断，并切换页码参数并请求最新数据
 *  3.3 点击上一页，做临界值判断，并切换页码参数并请求最新数据
 */
// 3.2 点击下一页，临界值判断，并切换页码参数并请求最新数据
document.querySelector('.next').addEventListener('click',(e)=>{
  if(queryObj.page < total_count / queryObj.per_page){
    queryObj.page++
    getArticleList()
  }
  else alert('已经到最后一页了')
})
// 3.3 点击上一页，做临界值判断，并切换页码参数并请求最新数据
document.querySelector('.last').addEventListener('click',(e)=>{
  if(queryObj.page > 1){
    queryObj.page--
    getArticleList()
  }
  else alert('已经到第一页了')
})
/**
 * 目标4：删除功能
 *  4.1 关联文章 id 到删除图标
 *  4.2 点击删除时，获取文章 id
 *  4.3 调用删除接口，传递文章 id 到服务器
 *  4.4 重新获取文章列表，并覆盖展示
 *  4.5 删除最后一页的最后一条，需要自动向前翻页
 */
// 4.1 关联文章 id 到删除图标
// 在获取文章列表函数里设置自定义属性data-id = item.id

// 4.2 点击删除时，获取文章id   字体图标不能点击
document.querySelector('.art-list').addEventListener('click',e=>{
  if(e.target.classList.contains('del')){
    const delId = e.target.parentNode.dataset.id
    // 4.3 调用删除接口，传递文章id到服务器
    axios({
      url:`/v1_0/mp/articles/${delId}`,
      method:"delete",
    }).then(result=>{
      // alert(result.message ='删除成功')
    })
    // 4.5 删除最后一页的最后一条时，page--
    const children = document.querySelector('.art-list').children
  if(children === 1 && queryObj.page != 1){
    queryObj.page--
  }
    // 4.4 重新获取文章列表，并覆盖展示
    setTimeout(getArticleList,1500)
  }
})

// 点击编辑时，获取文章 id，跳转到发布文章页面传递文章 id 过去
document.querySelector('.art-list').addEventListener('click',e=>{
  if(e.target.classList.contains('edit')){
    const artId = e.target.parentNode.dataset.id
    location.href = `../publish/index.html?id=${artId}`
  }
})

