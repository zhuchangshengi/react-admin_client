#描述
##这是一个后台同事写的一个小项目，前端UI框架antd,该项目只写了商品模块，之后的用户管理和角色管理如果业余时间足够的话还是可以继续写的，此项目完全是我算是入门react,写的不好的敌方请多多指教。
###如果登录不上去，就去pages文件夹中的admin文件夹中的index.jsx这段话注释，如下：
  *const user =  memoryUtils.user;
        if(!user || !user.id){
            return <Redirect to='/login'/>
   }
   注释结束后再浏览器url那里把/login改为/home就可以进去了
#### 接口请求数据再api中封装
   * 当前值封装了get和post。
#### assets文件夹存放静态文件

#### components封装了公共组件

#### config文件夹存放了菜单栏

#### utils为工具模块
* 用户名存储
* 时间格式化

#### 脚手架版本:
*  react: ^17.0.2

#### 用到react相关的生态链模块:
* axios
* react-router-dom
* store
### 项目启动步骤
1. 安装包（这里需要使用npm进行安装，如果用cnpm或者yarn会有热更新失效的问题）
   npm install
2. 开发运行
   npm start
3. 生产打包
   npm run build
   
###ps:这里的代理我只写在了package.json