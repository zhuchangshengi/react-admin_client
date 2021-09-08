const {override, fixBabelImports,addLessLoader} = require('customize-cra');
module.exports = override(
    /*
* 根据antd实现按需打包：根据import来打包使用(babel-plugin-import)
* */
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,//自动打包相关的样式
    }),
    addLessLoader({
        lessOptions:{
            javascriptEnabled: true,
            modifyVars: {
                '@primary-color': '#1890ff'//更换全局主题色默认#1890ff
            },
        }
    }),
);
