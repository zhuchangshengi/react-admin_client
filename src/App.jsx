import React,{Component} from 'react';
import { BrowserRouter,Route,Switch } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';  // 引入中文包
import Login from "./pages/login";
import Index from "./pages/admin";
/*
应用的根组件
* */
export default class App extends Component {
    render() {
        return(
            <BrowserRouter>
                <ConfigProvider locale={zhCN}>
                    <Switch>
                        {/*只匹配其中一个*/}
                        <Route path="/login" component={Login}></Route>
                        <Route path="/" component={Index}></Route>
                    </Switch>
                </ConfigProvider>
            </BrowserRouter>
        )
    }
}