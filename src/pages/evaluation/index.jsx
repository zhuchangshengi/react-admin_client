import React, {Component} from 'react';
import {
    Button,
    Card,
    Input,
    message,
    Pagination,
    Table,
    Space,
    Modal,
    Form,
    Row,
    Col,
    TreeSelect,
    DatePicker, Select
} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {
    brandTtree, displacementAdd, emissionAdd,
    evaluation, gearboxType, evaluationAdd, queryCarNature
} from '../../api/index';
import moment from "moment";
import axios from "axios";

const {Option} = Select;
const {Search, TextArea} = Input;
const Item = Form.Item;
const {TreeNode} = TreeSelect;
const autoSize = {minRows: 3, maxRows: 5};
const { confirm } = Modal;
export default class Index extends Component {
    formRef = React.createRef();
    state = {
        visible: false,
        title: '',
        total: 0,
        dataSource: [],
        pageSize: 20,
        currentPage: 1,
        brandSelect: [],
        gearboxType: [],
        emission: [],
        displacement: [],
        natureOperations: [],
        datePickerTime: moment(new Date()),
        currentId: null,
    }
    getBrandTree = async () => {
        const {code, data} = await brandTtree();
        if (code === 200) {
            this.setState({brandSelect: data});
        } else {
            message.error("获取品牌列表失败！");
        }
    }
    getQueryCarNature = async () => {
        const {code, data} = await queryCarNature();
        if (code === 200) {
            this.setState({natureOperations: data})
        } else {
            message.error("获取运营性质失败！");
        }
    }
    /*父节点*/
    renderTreeNode = (treeData) => {
        let treeNode = [];
        treeData.map(item =>
            treeNode.push(
                <TreeNode value={item.id} title={item.brandName} id={item.id}>
                    {this.renderChild1(item)}
                </TreeNode>)
        )
        return treeNode;
    }
    /*一级子节点*/
    renderChild1 = (element) => {
        let child1 = [];
        if (element.childs) {
            element.childs.map(item => child1.push(<TreeNode value={item.id} title={item.brandName}
                                                             id={item.id}></TreeNode>));
        }
        return child1;
    }
    getGearboxType = async () => {
        let {code, data} = await gearboxType();
        if (code === 200) {
            this.setState({gearboxType: data});
        } else {
            message.error("获取变速箱类型失败！");
        }
    }
    getEmissionStandard = async () => {
        const {code, data} = await emissionAdd();
        if (code === 200) {
            this.setState({emission: data})
        } else {
            message.error("获取排放标准失败！");
        }
    }
    getDisplacement = async () => {
        const {code, data} = await displacementAdd();
        if (code === 200) {
            this.setState({displacement: data})
        } else {
            message.error("获取排量标准失败！");
        }
    }
    onSearch = (id) => {
        const {pageSize, currentPage} = this.state;
        this.getQueryAmoy('', '', '', '', '', '', '', '', currentPage, pageSize, id);
    }
    setVisible = (bool, title) => {
        if (this.formRef.current) this.formRef.current.resetFields();//重置表单
        this.setState({visible: bool, title, currentId: null})
    }
    onChange = (currentPage, pageSize) => {
        this.setState({
            pageSize,
            currentPage
        }, () => {
            this.getQueryAmoy('', '', '', '', '', '', '', '', currentPage, pageSize);
        })
    }
    onFinish = async (val) => {
        const registrationTime = moment(val.registrationTime).format('YYYY-MM-DD');
        const {
            brand,
            ageLimit,
            carRevenue,
            price,
            carOwner,
            phone,
            vehicleCondition,
            attention,
            sellable,
            color,
            gearboxType,
            emissionStandard,
            emissionsStandards,
            natureOperations
        } = val;
        const {pageSize, currentPage, title, currentId} = this.state;
        const {code} = await evaluationAdd(brand, ageLimit, carRevenue, price, registrationTime, carOwner, phone, vehicleCondition, attention, sellable, color, gearboxType, emissionStandard, emissionsStandards, natureOperations,currentId);
        if (code === 200) {
            this.setState({visible: false});
            this.getQueryAmoy("", "", "", "", "", "", "", "", currentPage, pageSize);
            message.success(`${title}成功！`);
        } else {
            message.error(`${title}失败！`);
        }
    }
    modification = (text, record, index) => {
        const { brandId,carModel,mileages,price,callName,phone,carDescribe,isFollowId,registrationYear,isSellId,color,carTransmissionId,emissionId,displacementId,carNatureId, id } = record;
        this.setState({visible: true, title: '修改', currentId: id}, () => {
            this.formRef.current.setFieldsValue({
                brand: brandId,
                ageLimit: carModel,
                carRevenue: mileages,
                price,
                carOwner: callName,
                phone,
                vehicleCondition: carDescribe,
                attention: isFollowId,
                sellable: isSellId,
                color,
                registrationTime: moment(registrationYear),
                gearboxType: carTransmissionId,
                emissionStandard: emissionId,
                emissionsStandards: displacementId,
                natureOperations: carNatureId
            });
        })

    }
    deleteItem = (text, record, index) => {
        const that = this;
        const {pageSize, currentPage} = this.state;
        confirm({
            title: '是否确认删除?',
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            // 点击确认触发
            onOk() {
                const { id } = record;
                axios.delete('/evaluation/'+id).then((res)=>{
                    const { data:{code} } = res;
                    if(code  === 200){
                        that.getQueryAmoy("", "", "", "", "", "", "", "", currentPage, pageSize);
                        message.success("删除成功！");
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
    getQueryAmoy = async (brandId, carModel, carTransmissionId, emissionId, displacementId, carNatureId, isSellId, isFollowId, currentPage, size,id = '') => {
        const {
            data,
            code
        } = await evaluation(brandId, carModel, carTransmissionId, emissionId, displacementId, carNatureId, isSellId, isFollowId, currentPage, size, id);
        if (code === 200) {
            this.setState({total: data.totalSize, dataSource: data.data});
        } else {
            message.error("获取估价模块数据失败！");
        }
    }

    componentDidMount() {
        this.getQueryAmoy("", "", "", "", "", "", "", "", 1, 20);
        this.getBrandTree();
        this.getGearboxType();
        this.getEmissionStandard();
        this.getDisplacement();
        this.getQueryCarNature();

    }

    selecte = (type, number) => {
        switch (type) {
            case "carTransmissionId"://变速箱类型
                switch (number) {
                    case 1:
                        return '手动'
                    case 2:
                        return '自动'
                    default:
                        return '手动'
                }
                break;
            case "emissionId": //排放标准
                switch (number) {
                    case 6:
                        return '啊阿达'
                    case 5:
                        return '国六'
                    case 4:
                        return '国五'
                    case 3:
                        return '国四'
                    case 2:
                        return '国三'
                    default:
                        return '啊阿达'
                }
                break;
            case "displacementId"://排量标准
                switch (number) {
                    case 9:
                        return '1.5T'
                    case 8:
                        return '1.2T'
                    case 7:
                        return '2.0L'
                    case 6:
                        return '1.8L'
                    case 5:
                        return '1.6L'
                    case 4:
                        return '1.5L'
                    case 3:
                        return '1.3L'
                    default:
                        return '1.3L'
                }
                break;
            case "carNatureId"://变速箱类型
                switch (number) {
                    case 1:
                        return '营运'
                    case 2:
                        return '非营运'
                    default:
                        return '营运'
                }
                break;
            case "sellStatusId"://售卖状态
                switch (number) {
                    case 1:
                        return '未售出'
                    case 2:
                        return '已预订'
                    case 3:
                        return '已售出'
                    default:
                        return '未售出'
                }
                break;
        }
    }

    render() {
        const {
            dataSource,
            currentPage,
            pageSize,
            total,
            title,
            visible,
            brandSelect,
            datePickerTime,
            gearboxType,
            emission,
            displacement,
            natureOperations
        } = this.state;
        const columns = [
            {
                title: '序号',
                render: (text, record, index) => `${index + 1}`
            },
            {
                title: '品牌名',
                dataIndex: 'brandName',
                key: 'brandName',
            },
            {
                title: '车型',
                dataIndex: 'carModel',
                key: 'carModel',
            },
            {
                title: '公里数',
                dataIndex: 'mileages',
                key: 'mileages',
            },
            {
                title: '变速箱类型',
                dataIndex: 'carTransmissionId',
                key: 'carTransmissionId',
                render: text => this.selecte("carTransmissionId", text)
            },
            {
                title: '排放标准',
                dataIndex: 'emissionId',
                key: 'emissionId',
                render: text => this.selecte("emissionId", text)
            },
            {
                title: '排量',
                dataIndex: 'displacementId',
                key: 'displacementId',
                render: text => this.selecte("displacementId", text)
            },
            {
                title: '营运性质',
                dataIndex: 'carNatureId',
                key: 'carNatureId',
                render: text => this.selecte("carNatureId", text)
            },
            {
                title: '变速箱类型',
                dataIndex: 'carTransmissionName',
                key: 'carTransmissionName',
            },
            {
                title: '排放标准',
                dataIndex: 'emissionName',
                key: 'emissionName',
            },
            {
                title: '排量标准',
                dataIndex: 'displacementName',
                key: 'displacementName',
            },
            {
                title: '颜色',
                dataIndex: 'color',
                key: 'color',
            },
            {
                title: '上牌时间',
                dataIndex: 'registrationYear',
                key: 'registrationYear',
            },
            {
                title: '价格',
                dataIndex: 'price',
                key: 'price',
            },
            {
                title: '是否关注',
                dataIndex: 'isFollowId',
                key: 'isFollowId',
            },
            {
                title: '操作',
                key: '操作',
                render: (text, record, index) => (
                    <Space size="middle">
                        <Button type="link" onClick={() => this.modification(text, record, index)}>修改</Button>
                        <Button type="link" danger onClick={() => this.deleteItem(text, record, index)}>删除</Button>
                    </Space>
                ),
            },
        ]
        return (
            <Card title="估价模块" extra={
                <div style={{display: 'flex'}}>
                    <Search placeholder="请输入id来查询" onSearch={this.onSearch} enterButton/>
                    <Button type="primary" icon={<PlusOutlined/>}
                            onClick={() => this.setVisible(true, "新增")}>新增</Button>
                </div>
            }>
                <Table dataSource={dataSource} columns={columns} pagination={false} scroll={{y: 900}}/>
                <Pagination current={currentPage} defaultPageSize={pageSize} total={total} onChange={this.onChange}/>
                <Modal
                    title={title}
                    centered
                    visible={visible}
                    width={2000}
                    onCancel={() => this.setVisible(false)}
                    footer={
                        [] // 设置footer为空，去掉 取消 确定默认按钮
                    }

                >
                    <Form
                        ref={this.formRef}
                        name="basic"
                        labelCol={{span: 4}}
                        onFinish={this.onFinish}
                    >
                        <Row>
                            <Col span={6}>
                                <Item label="品牌"
                                      name="brand">
                                    <TreeSelect placeholder={'请选择品牌名'}>
                                        {
                                            this.renderTreeNode(brandSelect)
                                        }
                                    </TreeSelect>
                                </Item>
                            </Col>
                            <Col span={6}>
                                <Item label="车型"
                                      name="ageLimit">
                                    <TextArea placeholder={'请输入车型'} autoSize={autoSize}/>
                                </Item>
                            </Col>
                            <Col span={6}>
                                <Item label="公里数"
                                      name="carRevenue">
                                    <TextArea placeholder={'请输入车辆公里数'} autoSize={autoSize}/>
                                </Item>
                            </Col>
                            <Col span={6}>
                                <Item label="价格"
                                      name="price">
                                    <TextArea placeholder={'请输入价格'} autoSize={autoSize}/>
                                </Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={6}>
                                <Item label="上牌时间"
                                      name="registrationTime">
                                    <DatePicker defaultPickerValue={datePickerTime} />
                                </Item>
                            </Col>
                            <Col span={6}>
                                <Item label="车主"
                                      name="carOwner"
                                >
                                    <TextArea placeholder={'请输入车主名称'} autoSize={autoSize}/>
                                </Item>
                            </Col>
                            <Col span={6}>
                                <Item label="电话"
                                      name="phone">
                                    <TextArea placeholder={'请输入电话'} autoSize={autoSize}/>
                                </Item>
                            </Col>
                            <Col span={6}>
                                <Item label="车况"
                                      name="vehicleCondition">
                                    <TextArea placeholder={'请输入车况'} autoSize={autoSize}/>
                                </Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={6}>
                                <Item label="是否关注"
                                      name="attention">
                                    <Select placeholder={'请选择'}>
                                        <Option value={1}>关注</Option>
                                        <Option value={0}>未关注</Option>
                                    </Select>
                                </Item>
                            </Col>
                            <Col span={6}>
                                <Item label="是否出售"
                                      name="sellable">
                                    <Select placeholder={'请选择'}>
                                        <Option value={1}>出售</Option>
                                        <Option value={0}>未出售</Option>
                                    </Select>
                                </Item>
                            </Col>
                            <Col span={6}>
                                <Item label="颜色"
                                      name="color">
                                    <TextArea placeholder={'请输入颜色'} autoSize={autoSize}/>
                                </Item>
                            </Col>
                            <Col span={6}>
                                <Item label="变速箱类型"
                                      name="gearboxType"
                                >
                                    <Select placeholder={'请选择变速箱类型'}>
                                        {
                                            gearboxType.map(item => (
                                                <Option value={item.id}>{item.transmissionName}</Option>))
                                        }
                                    </Select>
                                </Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={6}>
                                <Item label="排放标准"
                                      name="emissionStandard"
                                >
                                    <Select placeholder={'请选择排放标准'}>
                                        {
                                            emission.map(item => (
                                                <Option value={item.id}>{item.emissionName}</Option>))
                                        }
                                    </Select>
                                </Item>
                            </Col>
                            <Col span={6}>
                                <Item label="排量标准"
                                      name="emissionsStandards"
                                >
                                    <Select placeholder={'请选择排量标准'}>
                                        {
                                            displacement.map(item => (
                                                <Option value={item.id}>{item.displacementName}</Option>))
                                        }
                                    </Select>
                                </Item>
                            </Col>
                            <Col span={6}>
                                <Item label="运营性质"
                                      name="natureOperations"
                                >
                                    <Select placeholder={'请选择运营性质'}>
                                        {
                                            natureOperations.map(item => (
                                                <Option value={item.id}>{item.carNatureName}</Option>))
                                        }
                                    </Select>
                                </Item>
                            </Col>
                            <Col span={6}></Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <Item
                                    wrapperCol={{
                                        offset: 12,
                                        span: 16,
                                    }}>
                                    <Button type="primary" htmlType="submit">提交</Button>
                                </Item>
                            </Col>
                            <Col span={12}>
                                <Item
                                    wrapperCol={{
                                        offset: 12,
                                        span: 16,
                                    }}>
                                    <Button htmlType="button" onClick={() => this.setVisible(false)}>取消</Button>
                                </Item>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </Card>
        )
    }
}