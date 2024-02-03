/**
 * 目标：网站-更换背景
 *  1. 选择图片上传，设置body背景
 *  2. 上传成功时，"保存"图片url网址
 *  3. 网页运行后，"获取"url网址使用
 * */

// 1.绑定 change 事件
document.querySelector('#bg').addEventListener('change', (e) => {
  console.log(e.target.files[0])
  // 1.1 获取图像对象并 赋予属性及值，键值对
  const fd = new FormData()
  fd.append('img',e.target.files[0])
  // 1.2 上传到服务器，并获取图像存储在服务器的地址
  axios({
    url:'http://hmajax.itheima.net/api/uploadimg',
    method:'POST',
    data:fd
  }).then(result=>{
    console.log(result)
    // 1.3 获取图像地址，并用body标签显示
    const imgUrl = result.data.data.url
    const bgUrl = document.body.style.background = `url(${imgUrl}) repeat center`

    // 2 上传成功，在本地保存url地址
    localStorage.setItem('bgImg',bgUrl)
  })
})

// 3. 网页运行后，获取本地 url 使用
const bgUrl = localStorage.getItem('bgImg');
console.log(bgUrl)
bgUrl && (document.querySelector('body').style.background = bgUrl)