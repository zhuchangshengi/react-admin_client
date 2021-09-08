import React,{Component} from "react";
import {Table, message, Space, Button, Card, Input, Modal, Form} from "antd"
import { displacements,displacement } from '../../api/index'
import {PlusOutlined} from "@ant-design/icons";
import axios from "axios";
const { Search } = Input;
const { confirm } = Modal;
const Item = Form.Item //只能写在import之后
const laout = {
    labelCol:{ span: 4 },
    wrapperCol:{ span: 14 }
}
const tailLayout = {
    wrapperCol: {
        offset: 8,
        span: 16,
    },
};
export default class Category extends Component {
    formRef = React.createRef();
    state = {
        cement: [],
        visible: false,
        title: '',
        pl: '',//排量
        currentItem: [],
    }
    getdisplacement = async ()=>{
          const {data,code} = await displacements();
          if(code === 200){
              this.setState({cement: data})
          }else{
              message.error("获取排量接口失败！");
          }
    }
    /*排量搜索*/
    onSearch = async (val)=>{
        const {data,code} = await displacement(val);
        if(code === 200 && data){
             message.success("查询成功！")
             if(!Array.isArray(data)){
                 this.setState({cement: [data]})
             }else{
                 this.setState({cement: data})
             }
        }else{
            message.error('查询失败')
        }
    }
    onFinish = async (val)=>{
        const { title,currentItem } = this.state;
        const { pl } = val;
            const { code } = await displacement(pl,currentItem.id)
            if(code === 200){
                this.formRef.current.setFieldsValue({pl: ''})
                this.setState({
                    visible: false,
                })
                this.getdisplacement();
                message.success(`${title}排量成功！`)
            }else{
                message.error(`${title}排量失败！`)
            }
    }
    /*排量修改*/
    modification = (text, record,index)=>{
        const { displacementName } = record;
        this.setState({visible: true,title: '修改',currentItem: record},()=>{
            this.formRef.current.setFieldsValue({pl: displacementName})
        })
    }
    /*排量删除*/
    deleteItem = (text, record,index)=>{
        const that = this;
        confirm({
            title: '是否确认删除?',
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            // 点击确认触发
            onOk() {
                const { id } = record;
                axios.delete('/displacement/'+id).then((res)=>{
                    const { data:{code} } = res;
                    if(code  === 200){
                        that.getdisplacement();
                        message.success("删除成功！")
                    }else{
                        message.error('删除失败！');
                    }
                })
            },
            // 点击取消触发
            onCancel() {
                message.info("已取消")
            },
        });

    }
    setVisible = (bool,title)=>{
        this.setState({
            visible: bool,
            title,
            currentItem: [],
        })
    }
    componentDidMount(){
        this.getdisplacement()
    }
    render() {
        const {cement,visible,title,pl} = this.state;
        const columns = [
            {
                title: '序号',
                render:(text,record,index)=> `${index+1}`
            },
            {
                title: 'id',
                dataIndex: 'id',
                key: 'id',
            },
            {
                title: '排量',
                dataIndex: 'displacementName',
                key: 'id',
            },
            {
                title: '操作',
                key: '操作',
                render: (text, record,index) => (
                    <Space size="middle">
                        <Button type="link" onClick={()=>this.modification(text, record,index)}>修改</Button>
                        <Button type="link" danger onClick={()=>this.deleteItem(text, record,index)}>删除</Button>
                    </Space>
                ),
            }
         ]
        return(
            <Card title="排量管理"  extra={
                <div style={{display:  'flex'}}>
                    <Search placeholder="请输入排量id进行搜索" onSearch={this.onSearch} enterButton />
                    <Button type="primary" icon={<PlusOutlined />} onClick={()=>this.setVisible(true,"新增")}>新增</Button>
                </div>
            }>
                <Modal
                    title={title}
                    centered
                    visible={visible}
                    width={1000}
                    onCancel={()=> this.setVisible(false)}
                    footer={
                        [] // 设置footer为空，去掉 取消 确定默认按钮
                    }

                >
                    <Form
                        ref={this.formRef}
                        {...laout}
                        name="normal_login"
                        className="login-form"
                        initialValues={{pl}}
                        onFinish={this.onFinish}
                    >
                        <Item
                            label="排量"
                            name="pl"
                            rules={[{ required: true, message: '请输入排量' }]}
                        >
                            <Input/>
                        </Item>
                        <Item {...tailLayout}>
                            <Button type="primary" htmlType="submit">
                                提交
                            </Button>
                            &nbsp;&nbsp;&nbsp;
                            <Button htmlType="button" onClick={()=> this.setVisible(false)}>
                                取消
                            </Button>
                        </Item>
                    </Form>
                </Modal>
                <Table dataSource={cement} columns={columns} pagination={false} scroll={{ y: 900 }}/>
            </Card>
        )
    }
}