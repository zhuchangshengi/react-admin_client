import {get, post} from "./ajax"

export const reqLogin = (userName, userPassword) => post('/user/login', {userName, userPassword})//登录接口
export const getTokenMd = (username, password) => get('/tokenMd')//获取TokenMd
export const getBrand = (brandName, parentId, currentPage, size) => get('/brand', {
    brandName,
    parentId,
    currentPage,
    size
})////获取品牌列表
export const brandParent = () => get("/brand/parent")//查询父节点信息
export const newBrand = (brandName, parentId, sortId, id) => post('/brand', {brandName, parentId, sortId, id})//新增品牌页面接口
export const displacements = () => get('/displacement')//获取所有
export const displacement = (displacementName, id) => post('/displacement/', {displacementName, id})//查询删除某个
export const emission = () => get('/emission');//排放所有接口查询
export const emissionItem = (id) => get('/emission/' + id);//排放所有接口查询
export const addEmission = (emissionName, id) => post('/emission', {emissionName, id})
export const brandTtree = () => get('/brand/tree');//品牌树
export const gearboxType = () => get('/carInfo/carTransmission');//变速箱类型
export const emissionAdd = () => get('/emission');//排放标准
export const displacementAdd = () => get('/displacement');//排量标准
export const queryCarNature = () => get('/carInfo/queryCarNature');//运营性质
export const queryCarInfoSellStatus = () => get('/carInfo/queryCarInfoSellStatus');//售卖状态
export const getCarInfo = (brandId, carModel, carTransmissionId, emissionId, displacementId, carNatureId, sellStatusId, isHot, currentPage, size, id) => get('/carInfo', {
    brandId,
    carModel,
    carTransmissionId,
    emissionId,
    displacementId,
    carNatureId,
    sellStatusId,
    isHot,
    currentPage,
    size,
    id
});//请求新增车辆表格数据
/*字段描述
* brandId：
* carModel：
* carTransmissionId：变速箱类型
* emissionId：排放标准
* displacementId：排量
* carNatureId：营运性质
* sellStatusId：售卖状态
* isHot：标注是否热门
* currentPage：
* size：
*
* */
export const getCarInfoPost = (brandId, carModel, carTransmissionId, emissionId, displacementId, carNatureId, sellStatusId, isHot, carRegistrationTime, color, carTitle, carMileage, carHighlights, carDescribe, carFloorPrice, carLoanPrice, carFullPrice, downPaymentPrice, carSort, sysCarInfoImgList,id) => post('/carInfo', {
    brandId,
    carModel,
    carTransmissionId,
    emissionId,
    displacementId,
    carNatureId,
    sellStatusId,
    isHot,
    carRegistrationTime,
    color,
    carTitle,
    carMileage,
    carHighlights,
    carDescribe,
    carFloorPrice,
    carLoanPrice,
    carFullPrice,
    downPaymentPrice,
    carSort,
    sysCarInfoImgList,
    id
});//新增车辆表格数据
export const queryAmoy = (brandId, carModel, carTransmissionId, emissionId, displacementId, carNatureId, isShow, isAmoy, currentPage, size, id) => get('/amoy', {
    brandId,
    carModel,
    carTransmissionId,
    emissionId,
    displacementId,
    carNatureId,
    isShow,
    isAmoy,
    currentPage,
    size,
    id
});//获取淘车模块接口
export const queryAmoyAdd = (carModel, brandId, years, isShow, orderSort, carDescribe, mileage, callName, phone, isAmoy, color, price, carTransmissionId, emissionId, displacementId, carNatureId, id) => post('/amoy', {
    carModel,
    brandId,
    years,
    isShow,
    orderSort,
    carDescribe,
    mileage,
    callName,
    phone,
    isAmoy,
    color,
    price,
    carTransmissionId,
    emissionId,
    displacementId,
    carNatureId,
    id
});//新增淘车模块接口
export const evaluation = (brandId, carModel, carTransmissionId, emissionId, displacementId, carNatureId, isSellId, isFollowId, currentPage, size, id) => get('/evaluation', {
    brandId,
    carModel,
    carTransmissionId,
    emissionId,
    displacementId,
    carNatureId,
    isSellId,
    isFollowId,
    currentPage,
    size,
    id
});//估价模块数据获取
export const evaluationAdd = (brandId, carModel, mileages, price, registrationYear, callName, phone, carDescribe, isFollowId, isSellId, color, carTransmissionId, emissionId, displacementId, carNatureId, id) => post('/evaluation', {
    brandId,
    carModel,
    mileages,
    price,
    registrationYear,
    callName,
    phone,
    carDescribe,
    isFollowId,
    isSellId,
    color,
    carTransmissionId,
    emissionId,
    displacementId,
    carNatureId,
    id
});//估价模块新增