import React,{ Component } from "react";
import {Input, Select, message, Button, Modal, Form} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {brandParent, newBrand} from '../../api'
const { Option } = Select;
const { Search } = Input;
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
export default class SearchSelect extends Component {
    state = {
        data: [],
        visible: false,
    }
    handleChange = (val)=>{
        const { data } = this.state;
        const { handleSelect } = this.props;
        const id = data.filter(item => item.brandName === val);
        if(id.length !== 0){
            handleSelect(id[0].id);
        } else {
            handleSelect()
        }
    }
    onSearch  = (val)=>{
        const { handleSearch } = this.props;
        handleSearch(val)
    }
    getBrandParent = async ()=>{
        const { code, data} = await brandParent();
        if(code === 200){
            this.setState({data})
        }else{
            message.error("获取查询父节点信息失败")
        }
    }
    handleChangeFjdmc = (val)=>{
        console.log(val)
    }
    onFinish = async (val)=>{
        const { data } = this.state;
        let { ppm, fjdmc, px} = val;
        if(fjdmc ==='不限'){
            fjdmc = ''
        }else{
            const id = data.filter(item => item.brandName === fjdmc);
            fjdmc = id[0].parentId
        }
        const { code } = await newBrand(ppm,fjdmc,px);
        if(code === 200){
            message.success("新增数据成功！");
            this.props.addItem();
            this.setVisible(false)
        }else{
            message.error("服务器端异常！");
        }
    }
    setVisible = (visible)=>{
        if(visible === "form"){
           this.onFinish()
            return;
        }
        this.setState({visible})
    }
    componentDidMount() {
        this.getBrandParent()
    }
    render() {
        const { data,visible } = this.state
        return(
            <div style={{display:  'flex'}} className="formSubmit">
                <Search placeholder="请输入品牌进行搜索" onSearch={this.onSearch} enterButton />
                <Select defaultValue="不限" style={{ width: 120 }} onChange={this.handleChange}>
                    <Option key={new Date().getTime()} value='不限'>不限</Option>
                    {
                        data.map( item  => <Option key={item.id} value={item.brandName}>{item.brandName}</Option>)
                    }
                </Select>
                <Button type="primary" icon={<PlusOutlined />} onClick={()=>this.setVisible(true)}>新增</Button>
                <Modal
                    title="新增"
                    centered
                    visible={visible}
                    width={1000}
                    onCancel={()=> this.setVisible(false)}
                    footer={
                        [] // 设置footer为空，去掉 取消 确定默认按钮
                    }

                >
                    <Form
                        {...laout}
                        name="normal_login"
                        className="login-form"
                        initialValues={{ppm:'',px: '90',fjdmc: '不限'}}
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
                                    data.map( item  => <Option key={item.id} value={item.brandName}>{item.brandName}</Option>)
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
            </div>
        )
    }
}