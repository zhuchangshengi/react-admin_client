import React,{ Component,Suspense } from 'react'
import { Redirect,Route,Switch } from 'react-router-dom'
import { Layout,Spin } from 'antd';
import memoryUtils from "../../utils/memoryUtils";
import LeftNav from "../../components/left-nav";
import Header from "../../components/header";
import Home from "../home";
import Category from "../category";
import Product from "../product";
import DisCharge from "../discharge";
import Carnewadd from "../carnewadd";
import Role from "../role";
import User from "../user";
import taoCar from "../taoCar";
import Evaluation from "../evaluation";
// const LeftNav =  lazy(() => import(/* webpackChunkName: "left-nav" */'../../components/left-nav'))
// const Header =  lazy(() => import(/* webpackChunkName: "header" */'../../components/header'))
// const Home =  lazy(() => import(/* webpackChunkName: "home" */"../home"))
// const Category =  lazy(() => import(/* webpackChunkName: "category" */"../category"))
// const Product =  lazy(() => import(/* webpackChunkName: "product" */"../product"))
// const Role =  lazy(() => import(/* webpackChunkName: "role" */"../role"))
// const User =  lazy(() => import(/* webpackChunkName: "user" */"../user"))
const { Footer, Sider, Content } = Layout;

export default class Index extends Component {
    render() {
        /*如果user不存在就登录*/
        const user =  memoryUtils.user;
        if(!user || !user.id){
            return <Redirect to='/login'/>
        }
        return (
             <Layout style={{height: "100%"}}>
                    <Sider width="256">
                        <LeftNav/>
                    </Sider>
                    <Layout>
                        <Header/>
                        <Content style={{margin: 20,backgroundColor: '#fff'}}>
                            <Suspense fallback={<Spin/>}>
                                <Switch>
                                    <Route path='/home' component={Home}></Route>
                                    <Route path='/DisCharge' component={DisCharge}></Route>
                                    <Route path='/category' component={Category}></Route>
                                    <Route path='/product' component={Product}></Route>
                                    <Route path='/carnewadd' component={Carnewadd}></Route>
                                    <Route path='/role' component={Role}></Route>
                                    <Route path='/user' component={User}></Route>
                                    <Route path='/taocar' component={taoCar}></Route>
                                    <Route path='/evaluation' component={Evaluation}></Route>
                                    <Redirect to='/home'/>
                                </Switch>
                            </Suspense>

                        </Content>
                        <Footer style={{textAlign: "center",color: '#ccc'}}>车辆管理后台系统</Footer>
                    </Layout>
              </Layout>
        )
    }
}