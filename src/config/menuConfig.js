import {
    HomeOutlined,
    AppstoreOutlined,
    BarsOutlined,
    ToolOutlined,
    UserOutlined,
    TagOutlined,
    PlusCircleOutlined,
    TransactionOutlined,
    SolutionOutlined,
    SafetyCertificateOutlined,
} from '@ant-design/icons';
const menuList = [{
    title: '首页',// 菜单标题名称
    key: '/home', // 对应的 path
    icon: <HomeOutlined/>, // 图标名称
   },
    {   title: '商品',
        key: '/products',
        icon: <AppstoreOutlined/>,
        children: [ // 子菜单列表
            {
                title: '排量管理',
                key: '/category',
                icon: <BarsOutlined/>
            },
            {
                title: '品牌管理',
                key: '/product',
                icon: <ToolOutlined/>
            },
            {
                title: '排放管理',
                key: '/discharge',
                icon: <TagOutlined />
            },
            {
                title: '售卖车辆',
                key: '/carnewadd',
                icon: <PlusCircleOutlined />
            },
            {
                title: '淘车模块',
                key: '/taocar',
                icon: <SolutionOutlined />
            },
            {
                title: '估价模块',
                key: '/evaluation',
                icon: <TransactionOutlined />
            },
            ]
    },
    {
        title: '用户管理',
        key: '/user',
        icon: <UserOutlined/>
    },
    {
        title: '角色管理',
        key: '/role',
        icon: <SafetyCertificateOutlined/>,
    }];
export default menuList