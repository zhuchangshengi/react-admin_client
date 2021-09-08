import React,{Component} from 'react';
import {Form, Input, Button, message } from 'antd';
import {UserOutlined, LockOutlined} from '@ant-design/icons';
import { Redirect } from 'react-router-dom'
import { reqLogin/*, getTokenMd*/ } from '../../api';
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import './login.less'
import logo from '../../assets/images/logo.webp'
const Item = Form.Item //只能写在import之后
export default class LoginForm extends Component {
    /*对密码自定义规则*/
     passWordCallback = (rule,value,callback) =>{
        if(!value){
            callback("密码不能为空！")
        }else if(value.length < 4) {
            callback("密码长度不能小于4位！")
        }else if(value.length > 12){
            callback("密码长度不能大于12位！")
        }else if(!/^[a-zA-Z0-9_]+$/.test(value)){
            callback("密码必须是英文丶数字或下划线组成！")
        }else{
            callback()
        }
    }
    /*表单提交*/
     onFinish = async (values) => {
        const { username, password } = values;
        const { code,data } = await reqLogin(username,password);
        //const data = await getTokenMd();
         console.log(data,"111111");
        if(Object.is(code,200)){
            //登录成功
            message.success("登录成功！");
            memoryUtils.user = data
            storageUtils.saveUser(data);//保存到内存中
            this.props.history.replace('/')
        }else{
            //登录失败
            message.error("登录失败！")
        }
    }
    render() {
         /*如果user存在就自动登录*/
         const user = memoryUtils.user
         if(user && user._id){
             return <Redirect to='/'/>
         }
        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo"/>
                    <h1>车辆管理系统</h1>
                </header>
                <section className="login-content">
                    <h2>用户登录</h2>
                    <div>
                        <Form
                            name="normal_login"
                            className="login-form"
                            initialValues={{remember: true}}
                            onFinish={this.onFinish}
                        >
                            <Item
                                name="username"
                                rules={[
                                    { required: true,whitespace: true, message: '请输入用户名!'},
                                    { min: 4, message: '用户名至少4位!'},
                                    { max: 12, message: '用户名最多12位!'},
                                    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文丶数字或下划线组成！'},
                                ]}>
                                <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="用户名"/>
                            </Item>
                            <Item
                                name="password"
                                rules={[{validator: this.passWordCallback}]}>
                                <Input
                                    prefix={<LockOutlined className="site-form-item-icon"/>}
                                    type="password"
                                    placeholder="密码"
                                />
                            </Item>
                            <Item>
                                <Button type="primary" htmlType="submit" className="login-form-button">
                                    登录
                                </Button>
                            </Item>
                        </Form>
                    </div>
                </section>
            </div>
        )
    }
}