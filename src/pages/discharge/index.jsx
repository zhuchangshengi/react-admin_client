import React,{Component} from "react";
import {Button, Card, Form, Input, message, Modal, Space, Table} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {emission,addEmission,emissionItem} from '../../api/index';
import axios from "axios";
const { Search } = Input;
const Item = Form.Item;
const { confirm } = Modal;
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
export default class DisCharge extends Component {
    formRef = React.createRef();
    state = {
        visible: false,
        title: '',
        currentItem: [],
        emissionData: [],
        pf: '',
    }
    onSearch = async (val)=>{
      const {data, code} = await emissionItem(val);
        if(code === 200 && data){
            message.success("查询成功！")
            if(!Array.isArray(data)){
                this.setState({emissionData: [data]})
            }else{
                this.setState({emissionData: data})
            }
        }else{
            message.error('查询失败')
        }
    }
    setVisible = (bool,title)=>{
           this.setState({
               visible: bool,
               title,
               currentItem: [],
           })
    }
    onFinish = async (val)=>{
        const { title,currentItem } = this.state;
        const { pf } = val;
        const { code } = await addEmission(pf,currentItem.id)
        if(code === 200){
            this.formRef.current.setFieldsValue({pf: ''})
            this.setState({
                visible: false,
            })
            this.getEmission();
            message.success(`${title}排量成功！`)
        }else{
            message.error(`${title}排量失败！`)
        }
    }
    /*排放修改*/
    modification = (text, record,index)=>{
        const { emissionName } = record;
        this.setState({visible: true,title: '修改',currentItem: record},()=>{
            this.formRef.current.setFieldsValue({pf: emissionName})
        })
    }
    deleteItem  = (text, record,index)=>{
        const that = this;
        confirm({
            title: '是否确认删除?',
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            // 点击确认触发
            onOk() {
                const { id } = record;
                axios.delete('/emission/'+id).then((res)=>{
                    const { data:{code} } = res;
                    if(code  === 200){
                        that.getEmission();
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
    getEmission = async ()=>{
        const {code,data} = await emission();
        if(code === 200 && data && data.length){
            this.setState({
                emissionData: data
            })
        }else{
            message.error("查询失败！")
        }
    }
    componentDidMount(){
        this.getEmission()
    }
    render() {
        const { emissionData,title,visible,pf } = this.state;
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
                title: '排放',
                dataIndex: 'emissionName',
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
            <Card title="排放管理"  extra={
                <div style={{display:  'flex'}}>
                    <Search placeholder="请输入排放id进行搜索" onSearch={this.onSearch} enterButton />
                    <Button type="primary" icon={<PlusOutlined />} onClick={()=>this.setVisible(true,"新增")}>新增</Button>
               </div>
             }
            >
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
                        initialValues={{pf}}
                        onFinish={this.onFinish}
                    >
                        <Item
                            label="排放"
                            name="pf"
                            rules={[{ required: true, message: '请输入排放' }]}
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
                <Table dataSource={emissionData} columns={columns} pagination={false} scroll={{ y: 900 }}/>
            </Card>
        )
    }
}