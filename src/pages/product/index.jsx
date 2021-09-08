import React,{Component} from "react";
import {message, Card, Table, Pagination, Space, Button, Modal, Form, Input, Select} from "antd"
import axios from "axios";
import {brandParent, getBrand,newBrand} from '../../api/index'
import SearchSelect from '../../components/searchSelect'
const { confirm } = Modal;
const { Option } = Select;
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
export default class Product extends Component {
    formRef = React.createRef();
    state = {
        brands: Array.of(),
        brandName: '',
        parentId: '',
        currentPage: 1,
        size: 15,
        totalSize: '',
        pageSize: 20,
        visible: false,
        ppm: '',
        px: '',
        fjdmc: '',
        select: [],
        currentItem: [],
    }
    productGetBrand = async (brandName,parentId)=>{
       const { currentPage,size } = this.state
       const { code,data } = await getBrand(brandName,parentId,currentPage,size)
        if(code === 200){
            data.data.forEach( item => item.key = item.id )
            this.setState({brands: data,totalSize: data.totalSize})
        }else{
            message.error("获取品牌列表失败！")
        }
    }
    addItem = ()=>{
        this.productGetBrand();
    }
    handleSelect = (parentId)=>{
        const { brandName } = this.state
        this.setState({ parentId })
        this.productGetBrand(brandName,parentId)
    }
    handleSearch = (brandName)=>{
        const { parentId } = this.state
        this.setState({ brandName })
        this.productGetBrand(brandName,parentId)
    }
    onChange = (currentPage, pageSize)=>{
        console.log(currentPage,pageSize)
        this.setState({size: pageSize,currentPage},()=>{
            const {brandName,parentId} = this.state
            this.productGetBrand(brandName,parentId)
        })
    }
    /*修改数据*/
    modification = (text, record,index)=>{
        const {brandName, sortId, fBrandName} = record;
        this.setState({visible: true,currentItem: record},()=>{//
            this.formRef.current.setFieldsValue({ppm: brandName,px: sortId,fjdmc: fBrandName})
        })
    }
    /*删除数据*/
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
                axios.delete("/brand/"+ id).then((res)=>{
                   const { data:{code} } = res;
                   if(code  === 200){
                       that.productGetBrand();
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
    setVisible = (bool)=>{
        this.setState({visible: bool})
    }
    getBrandParent = async ()=>{
        const { code, data} = await brandParent();
        if(code === 200){
            this.setState({select: data})
        }else{
            message.error("获取查询父节点信息失败")
        }
    }
    onFinish = async (val)=>{
        const { currentItem } = this.state;
        const { ppm, px } = val;
        const {code} = await newBrand(ppm, currentItem.parentId, parseFloat(px),currentItem.id )
        if(code === 200){
            this.setState({visible: false});
            this.productGetBrand();
            message.success("修改成功")
        }else{
            message.error("修改失败")
        }
    }
    componentDidMount() {
        const { parentId } = this.state
        this.productGetBrand("",parentId);//获取品牌列表
        this.getBrandParent();
    }
    render() {
        const { brands:{data},totalSize,pageSize, currentPage,visible,ppm, px, fjdmc,select } =  this.state
        const columns = [
            {
                title: '品牌名',
                dataIndex: 'brandName',
                key: 'id',
            },
            {
                title: '父品牌名',
                dataIndex: 'fBrandName',
                key: 'id',
            },
            {
                title: '排序',
                dataIndex: 'sortId',
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
        ];
        return(
                <Card title="品牌管理" extra={<SearchSelect addItem={this.addItem} handleSelect={this.handleSelect} handleSearch={this.handleSearch}/>}>
                    <Table dataSource={data} columns={columns} pagination={false} scroll={{ y: 900 }}/>
                    <Pagination current={currentPage} total={totalSize} defaultPageSize={pageSize} onChange={this.onChange}/>
                    <Modal
                        title="修改"
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
                            initialValues={{ppm,px,fjdmc}}
                            onFinish={this.onFinish}
                        >
                            <Item
                                label="品牌名"
                                name="ppm"
                                rules={[{ required: true, message: '请输入品牌名' }]}
                            >
                                <Input/>
                            </Item>
                            <Item
                                label="排序"
                                name="px"
                                rules={[{ required: true, message: '请输入排序号' }]}
                            >
                                <Input/>
                            </Item>
                            <Item
                                label="父节点名称"
                                name="fjdmc"
                                rules={[{ required: true, message: '请选择父节点名称' }]}
                            >
                                <Select style={{ width: 120 }} onChange={this.handleChangeFjdmc}>
                                    <Option key={new Date().getTime()} value='不限'>不限</Option>
                                    {
                                        select.map((item)=> <Option key={item.id} value={item.brandName}>{item.brandName}</Option>)
                                    }
                                </Select>
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
                </Card>
        )
    }
}