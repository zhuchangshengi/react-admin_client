import React,{Component} from "react";
import { withRouter } from 'react-router-dom'
import { Modal,Button,message } from 'antd'
import menuList from "../../config/menuConfig";
import { formateDate } from "../../utils/dateUtils"
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import './index.less'
/*左侧导航组件*/
class Header extends Component{
    state = {
        currentTime: formateDate(new Date(),"YYYY-mm-dd HH:MM:SS")
    }
    componentDidMount() {
       this.getTime()
    }
    componentWillUnmount() {
        clearInterval(this.timer)
    }
    getTime = ()=>{
        this.timer = setInterval(()=>{
          const currentTime = formateDate(new Date(),"YYYY-mm-dd HH:MM:SS");
          this.setState({ currentTime })
        },1000)
    }
    getTitle = ()=>{
        const { pathname } = this.props.location;
        let title
        menuList.forEach(item=>{
            if(item.key === pathname){
                title = item.title
            }else if(item.children){
              const cItem = item.children.find(cItem=> cItem.key === pathname)
                if(cItem){
                    title = cItem.title
                }
            }
        })
        return title;
    }
    /*退出登录*/
    logout = ()=>{
        Modal.confirm({
            title: '确定退出登录吗？',
            okText: '确定',
            cancelText: "取消",
            onOk:()=>{
                storageUtils.removeUser();
                memoryUtils.user = {}
                this.props.history.replace("/login")
                message.success('已退出登录！')
            },
            onCancel:()=>{
                message.success('已取消退出登录！')
            }
        })
    }
    render() {
        const title = this.getTitle();
        const { userName } = memoryUtils.user;
        const { currentTime } = this.state;
        return(
            <div className="header">
                <div className="header-top">
                    <span>欢迎，{ userName }</span>
                    <Button type="link" onClick={this.logout}>退出</Button>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">
                        {title}
                    </div>
                    <div className="header-bottom-right">
                        <span>{ currentTime }</span>
                    </div>
                </div>
            </div>
        )
    }
}
export default withRouter(Header)