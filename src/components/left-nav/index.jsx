import React,{ Component } from "react";
import { Link,withRouter } from "react-router-dom";
import { Menu } from 'antd';
import menuList from '../../config/menuConfig'
import Logo from '../../assets/images/logo.webp'
import './index.less';
const { SubMenu } = Menu;
/*左侧导航组件*/
class LeftNav extends Component{
    getMenuNodes =  (menuList)=>{
        const { pathname } = this.props.location
       return  menuList.reduce((pre,cur)=>{
            if(!cur.children){
                pre.push((
                    <Menu.Item key={cur.key} icon={cur.icon}>
                        <Link to={cur.key}>
                            <span>{cur.title}</span>
                        </Link>
                    </Menu.Item>
                ))
            }else{
                const citem = cur.children.find(citem => pathname.indexOf(citem.key) === 0)
                if(citem){
                    this.openKey = cur.key
                }
              pre.push((
                  <SubMenu key={cur.key} icon={cur.icon} title={cur.title}>
                      {this.getMenuNodes(cur.children)}
                  </SubMenu>
              ))
            }
            return pre
        },[])
    }
    UNSAFE_componentWillMount() {
        this.menuNodes = this.getMenuNodes(menuList);
    }
    render() {
       let { pathname } = this.props.location
        if(pathname.indexOf("/product")===0){
            pathname = "/product"
        }
        const openKey = this.openKey
        return(
            <div className="left-nav">
                <Link to='/' className="left-nav-header">
                    <img src={Logo} alt=""/>
                    <h1>车辆管理</h1>
                </Link>
                {/*菜单*/}
                <div style={{ width: 256 }}>
                    <Menu
                        selectedKeys={[pathname]}
                        defaultOpenKeys={[openKey]}
                        mode="inline"
                        theme="dark"
                    >
                        {
                            this.menuNodes
                        }
                    </Menu>
                </div>
            </div>
        )
    }
}
export default withRouter(LeftNav)