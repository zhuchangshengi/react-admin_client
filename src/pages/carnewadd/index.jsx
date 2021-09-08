import React, {Component} from 'react';
import {
    Card,
    Form,
    message,
    TreeSelect,
    Input,
    DatePicker,
    Select,
    Upload,
    Modal,
    Row,
    Col,
    Button,
    Pagination,
    Table,
    Space,
    Image
} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {
    brandTtree,
    gearboxType,
    emissionAdd,
    displacementAdd,
    queryCarNature,
    queryCarInfoSellStatus,
    getCarInfo,
    getCarInfoPost
} from '../../api/index';
import moment from 'moment';
import 'moment/locale/zh-cn';
import axios from "axios";

const {TreeNode} = TreeSelect;
const Item = Form.Item;
const {TextArea, Search} = Input;
const {Option} = Select;
const {confirm} = Modal;
const autoSize = {minRows: 3, maxRows: 5};

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

export default class Index extends Component {
    formRef = React.createRef();
    state = {
        brandSelect: [],
        gearboxType: [],
        emission: [],
        displacement: [],
        natureOperations: [],
        sellingTheState: [],
        fileList: [],
        previewVisible: false,
        previewImage: '',
        previewTitle: '',
        visible: false,
        title: '',
        pageSize: 20,
        currentPage: 1,
        total: 0,
        dataSource: [],
        datePickerTime: moment(new Date()),
        currentId: null
    }
    onSearch = (id) => {
        const {pageSize, currentPage} = this.state;
        this.getCarInfo('', '', '', '', '', '', '', '', currentPage, pageSize, id);

    }
    setVisible = (bool, title) => {
        if (this.formRef.current) this.formRef.current.resetFields();//重置表单
        this.setState({visible: bool, title, currentId: null});
    }
    onChange = (currentPage, pageSize) => {
        this.setState({
            pageSize,
            currentPage
        }, () => {
            this.getCarInfo('', '', '', '', '', '', '', '', currentPage, pageSize);
        })
    }
    /*修改*/
    modification = (text, record, index) => {
        const {
            brandId,
            carModel,
            color,
            carTitle,
            carMileage,
            carRegistrationTime,
            carTransmissionId,
            emissionId,
            displacementId,
            carNatureId,
            carHighlights,
            carDescribe,
            carFloorPrice,
            carLoanPrice,
            carFullPrice,
            downPaymentPrice,
            sellStatusId,
            carSort,
            isHot,
            id
        } = record;
        this.setState({
            visible: true,
            title: '修改',
            currentId: id
        }, () => {
            this.formRef.current.setFieldsValue({
                brand: brandId,//品牌
                vehicleModel: carModel,//车型
                carColor: color,//颜色
                carTitle: carTitle,//标题
                carRevenue: carMileage,//公里数
                registrationTime: moment(carRegistrationTime),//上牌时间
                gearboxType: carTransmissionId,//变速箱类型
                emissionStandard: emissionId, //排放标准
                emissionsStandards: displacementId,//排量标准
                natureOperations: carNatureId,//运营性质
                vehicleWindow: carHighlights,//车辆亮点
                vehicleCondition: carDescribe,//车况
                hotTopic: isHot,
                lowPrice: carFloorPrice,//低价
                loanPrice: carLoanPrice,//贷款价
                fullPrice: carFullPrice,//全款价
                loanPayments: downPaymentPrice,//贷款首付
                sellingTheState: sellStatusId,//售卖状态
                sort: carSort,//排序
            })
        });
        axios.get(`/carInfo/${id}`).then(({data}) => {
            if (data.code === 200) {
                if (data.data.sysCarInfoImgList && data.data.sysCarInfoImgList.length) {
                    const photo = data.data.sysCarInfoImgList.map(item => {
                        return {
                            uid: item.id,
                            status: 'done',
                            // type: 'image/png',
                            url: item.smallImgUrl
                        }
                    })
                    this.setState({fileList: photo})
                }else{
                    this.setState({fileList: []})
                }
            }
        })
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
    // 删除
    deleteItem = (text, record, index) => {
        const {pageSize, currentPage} = this.state;
        const that = this;
        confirm({
            title: '是否确认删除?',
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            // 点击确认触发
            onOk() {
                axios.delete("/carInfo/" + record.id).then((res) => {
                    const {data: {code}} = res;
                    if (code === 200) {
                        that.getCarInfo('', '', '', '', '', '', '', '', currentPage, pageSize);
                        message.success("删除成功！");
                    } else {
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
    onFinish = async (val) => {
        const registrationTime = moment(val.registrationTime).format('YYYY-MM-DD');
        const sysCarInfoImgList = Array.of();
        const {
            brand,
            vehicleModel,
            gearboxType,
            emissionStandard,
            emissionsStandards,
            natureOperations,
            sellingTheState,
            hotTopic,
            carColor,
            carTitle,
            carRevenue,
            vehicleWindow,
            vehicleCondition,
            lowPrice,
            loanPrice,
            fullPrice,
            loanPayments,
            sort
        } = val;
        const {pageSize, currentPage, title, currentId, fileList} = this.state;
        for (let i = 0; i < fileList.length; i++) {
            sysCarInfoImgList.push(fileList[i].response.data);
        }
        let {code} = await getCarInfoPost(brand,
            vehicleModel,
            gearboxType,
            emissionStandard,
            emissionsStandards,
            natureOperations,
            sellingTheState,
            hotTopic,
            registrationTime,
            carColor, carTitle, carRevenue, vehicleWindow, vehicleCondition, lowPrice, loanPrice, fullPrice, loanPayments, sort, sysCarInfoImgList, currentId);
        if (code === 200) {
            this.setState({visible: false});
            this.getCarInfo("", "", "", "", "", "", "", "", currentPage, pageSize);
            message.success(`${title}成功！`);
        } else {
            message.error(`${title}失败！`);
        }
    }
    handleChange = ({fileList}) => {
        this.setState({fileList}, () => {
            // this.setState({fileList: [...this.state.fileList]});
        })
    }
    handleCancel = () => {
        this.setState({previewVisible: false})
    }
    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
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
    getBrandTree = async () => {
        const {code, data} = await brandTtree();
        if (code === 200) {
            this.setState({brandSelect: data});
        } else {
            message.error("获取品牌列表失败！");
        }
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
    getQueryCarNature = async () => {
        const {code, data} = await queryCarNature();
        if (code === 200) {
            this.setState({natureOperations: data})
        } else {
            message.error("获取运营性质失败！");
        }
    }
    getQueryCarInfoSellStatus = async () => {
        const {code, data} = await queryCarInfoSellStatus();
        if (code === 200) {
            this.setState({sellingTheState: data})
        } else {
            message.error("获取运营性质失败！");
        }
    }
    /*获取新增表格数据*/
    getCarInfo = async (brandId, carModel, carTransmissionId, emissionId, displacementId, carNatureId, sellStatusId, isHot, currentPage, size, id = '') => {
        const {
            code,
            data
        } = await getCarInfo(brandId, carModel, carTransmissionId, emissionId, displacementId, carNatureId, sellStatusId, isHot, currentPage, size, id);
        if (code === 200) {
            this.setState({total: data.totalSize, dataSource: data.data});
        } else {
            message.error("获取表格数据失败！");
        }
    }

    componentDidMount() {
        this.getCarInfo('', '', '', '', '', '', '', '', 1, 20);
        this.getBrandTree();
        this.getGearboxType();
        this.getEmissionStandard();
        this.getDisplacement();
        this.getQueryCarNature();
        this.getQueryCarInfoSellStatus();
    }

    render() {
        const {
            brandSelect,
            gearboxType,
            emission,
            displacement,
            natureOperations,
            sellingTheState,
            fileList,
            previewVisible,
            previewTitle,
            previewImage,
            visible,
            title,
            total,
            dataSource,
            currentPage,
            pageSize,
            datePickerTime
        } = this.state;
        const uploadButton = (
            <div>
                <PlusOutlined/>
                <div style={{marginTop: 8}}>上传图片</div>
            </div>
        );

        const columns = [
            {
                title: '品牌',
                dataIndex: 'brandName',
                key: 'brandName',
            },
            {
                title: '标题',
                dataIndex: 'carTitle',
                key: 'carTitle',
            },
            {
                title: '车型',
                dataIndex: 'carModel',
                key: 'carModel',
            },
            {
                title: '里程',
                dataIndex: 'carMileage',
                key: 'carMileage',
            },
            {
                title: '上牌时间',
                dataIndex: 'carRegistrationTime',
                key: 'carRegistrationTime',
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
                title: '运营性质',
                dataIndex: 'carNatureId',
                key: 'carNatureId',
                render: text => this.selecte("carNatureId", text)
            },
            {
                title: '配置亮点',
                dataIndex: 'carHighlights',
                key: 'carHighlights',
            },
            {
                title: '车辆描述',
                dataIndex: 'carDescribe',
                key: 'carDescribe',
            },
            {
                title: '底价',
                dataIndex: 'carFloorPrice',
                key: 'carFloorPrice',
            },
            {
                title: '贷款价',
                dataIndex: 'carLoanPrice',
                key: 'carLoanPrice',
            },
            {
                title: '全款价',
                dataIndex: 'carFullPrice',
                key: 'carFullPrice',
            },
            {
                title: '贷款首付',
                dataIndex: 'downPaymentPrice',
                key: 'downPaymentPrice',
            },
            {
                title: '售卖状态',
                dataIndex: 'sellStatusId',
                key: 'sellStatusId',
                render: text => this.selecte("sellStatusId", text)

            },
            {
                title: '排序',
                dataIndex: 'carSort',
                key: 'carSort',
            },
            {
                title: '是否热门',
                dataIndex: 'isHot',
                key: 'isHot',
                render: text => text === 1 ? '是' : '否'
            },
            {
                title: '上架时间',
                dataIndex: 'shelvesTime',
                key: 'shelvesTime',
            },
            {
                title: '颜色',
                dataIndex: 'color',
                key: 'color',
            },
            {
                title: '图片',
                dataIndex: 'sysCarInfoImgList',
                key: 'sysCarInfoImgList',
                render: imgs => {
                    if (imgs && imgs.length) {
                        return imgs.map((item, index) => {
                            return (
                                <div
                                    key={index}
                                    className="common-img-list"
                                    style={{
                                        width: "100px",
                                        height: "100px",
                                        marginLeft: "4px",
                                        overflow: "hidden"
                                    }}
                                >
                                    <Image
                                        style={{width: "100%"}}
                                        src={item.originImgUrl}
                                    />
                                </div>
                            )
                        })
                    }
                }
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
        ];
        return (
            <Card title="车辆新增" extra={
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
                        <Row gutter={16}>
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
                                      name="vehicleModel">
                                    <TextArea placeholder={'请输入车型'} autoSize={autoSize}/>
                                </Item>
                            </Col>
                            <Col span={6}>
                                <Item label="颜色"
                                      name="carColor">
                                    <TextArea placeholder={'请输入车辆颜色'} autoSize={autoSize}/>
                                </Item>
                            </Col>
                            <Col span={6}>
                                <Item label="标题"
                                      name="carTitle">
                                    <TextArea placeholder={'请输入车辆标题'} autoSize={autoSize}/>
                                </Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={6}>
                                <Item label="公里数"
                                      name="carRevenue">
                                    <TextArea placeholder={'请输入车辆公里数'} autoSize={autoSize}/>
                                </Item>
                            </Col>
                            <Col span={6}>
                                <Item label="上牌时间"
                                      name="registrationTime">
                                    <DatePicker defaultPickerValue={datePickerTime}/>
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
                        </Row>
                        <Row>
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
                            <Col span={6}>
                                <Item label="车辆亮点"
                                      name="vehicleWindow">
                                    <TextArea placeholder={'请输入车辆亮点'} autoSize={autoSize}/>
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
                                <Item label="低价"
                                      name="lowPrice">
                                    <TextArea placeholder={'请输入低价'} autoSize={autoSize}/>
                                </Item>
                            </Col>
                            <Col span={6}>
                                <Item label="贷款价"
                                      name="loanPrice">
                                    <TextArea placeholder={'请输入贷款价'} autoSize={autoSize}/>
                                </Item>
                            </Col>
                            <Col span={6}>
                                <Item label="全款价"
                                      name="fullPrice">
                                    <TextArea placeholder={'请输入全款价'} autoSize={autoSize}/>
                                </Item>
                            </Col>
                            <Col span={6}>
                                <Item label="贷款首付"
                                      name="loanPayments">
                                    <TextArea placeholder={'请输入贷款首付'} autoSize={autoSize}/>
                                </Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={6}>
                                <Item label="售卖状态"
                                      name="sellingTheState">
                                    <Select placeholder={'请选择售卖状态'}>
                                        {
                                            sellingTheState.map(item => (
                                                <Option value={item.id}>{item.stateName}</Option>))
                                        }
                                    </Select>
                                </Item>
                            </Col>
                            <Col span={6}>
                                <Item label="排序"
                                      name="sort">
                                    <TextArea placeholder={'请输入排序'} autoSize={autoSize}/>
                                </Item>
                            </Col>
                            <Col span={6}>
                                <Item label="热门"
                                      name="hotTopic">
                                    <Select placeholder={'是否热门'}>
                                        <Option value={1}>是</Option>
                                        <Option value={0}>否</Option>
                                    </Select>
                                </Item>
                            </Col>
                            <Col span={6}>
                                <Item label="车辆照片"
                                      name="carPhotos">
                                    <Upload

                                        action="/carInfo/uploadImg"
                                        name="multipartFile"
                                        listType="picture-card"
                                        fileList={fileList}
                                        onPreview={this.handlePreview}
                                        onChange={this.handleChange}
                                    >
                                        {fileList.length >= 12 ? null : uploadButton}
                                    </Upload>
                                    <Modal
                                        visible={previewVisible}
                                        title={previewTitle}
                                        footer={null}
                                        onCancel={this.handleCancel}
                                    >
                                        <img alt="example" style={{width: '100%'}} src={previewImage}/>
                                    </Modal>
                                </Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
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