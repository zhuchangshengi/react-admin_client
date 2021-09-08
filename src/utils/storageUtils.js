import store from 'store';
const USER_KEY = 'user_key';
const storageUtils = {
    /*
    * 保存
    * */
    saveUser(user){
        store.set(USER_KEY,user);
    },
    /*
    * 读取
    * */
    getUser(){
        return store.get(USER_KEY) || {};
    },
    /*
    删除
    * */
    removeUser(){
        store.remove(USER_KEY);
    }
}
export default storageUtils