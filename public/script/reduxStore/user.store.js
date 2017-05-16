import axios from '../axios'

const initialState = {
    list: [],
    select: {},
    data: {
        local: {}
    },
    appList: []
}

export function userReducer(state = initialState, action) {

    switch (action.type) {
        case 'USER_LIST':
            return Object.assign({}, state, { list: action.payload });
        case 'USER_LIST_APP':
            return Object.assign({}, state, { list: action.payload });
        case 'USER_SELECT':
            return Object.assign({}, state, { data: action.payload });
        case 'USER_SELECT_APP':
            return Object.assign({}, state, { appList: action.payload });
        case 'USER_CLEAR_SELECT':
            return Object.assign({}, state, { data: { status: false, local: {} } });
        default:
            return state
    }

}

export function userAction(store) {

    return {
        USER_TEST: function (id) {
            console.log(id);
        },
        USER_LIST: function () {
            var _this = pageUser;
            axios.get('/users/info')
                .then(res => {
                    store.dispatch({ type: 'USER_LIST', payload: res.data })
                    _this.nylonVisible(true);
                })
                .catch(err => {

                })
        },
        USER_LIST_APP: function (id) {
            var _this = pageUser;
            _this.AppId = id;
            axios.get('./users/userList?app_id=' + id)
                .then((response) => {
                    store.dispatch({ type: 'USER_LIST_APP', payload: response.data })
                })
                .catch((error) => {
                    console.log('error');
                    console.log(error);
                });
        },
        USER_SELECT: function (page,select,id) {
            var _this = window[page];
            axios.get(`/users/info/${id}`)
                .then(res => {
                    store.dispatch({ type: 'USER_SELECT', payload: res.data })
                    _this.selected = select;
                    _this.$$('panel-right').open();
                })
                .catch(err => {
                    console.log(err);
                })
        },
        USER_SELECT_APP: function (id) {
            var _this = pageUser;
            _this.selectAppID = id;
            axios.get('./roles/manageApps/' + id)
                .then((response) => {
                    _this.selected = 1;
                    _this.$$('panel-right').title = "ลงทะเบียน APP";
                    _this.$$('panel-right').open();
                    store.dispatch({ type: 'USER_SELECT_APP', payload: response.data })
                })
                .catch((error) => {
                    console.log('error');
                    console.log(error);
                });
        },
        USER_CLEAR_SELECT: function () {
            store.dispatch({ type: 'USER_CLEAR_SELECT' })
        },
        USER_INSERT: function (data) {
            var _this = pageUser;
            _this.fire('toast', { status: 'load' });
            // data.scope = data.scope.split(",");

            axios.post(`/users/user`, data)
                .then(res => {
                    this.USER_LIST_APP(_this.AppId);
                    // this.USER_LIST();
                    _this.fire('toast', {
                        status: 'success', text: 'บันทึกสำเร็จ',
                        callback: () => {
                            _this.$$('panel-right').close();
                        }
                    });
                })
                .catch(err => {
                    console.log(err);
                })
        },
        USER_DELETE: function (id) {
            var _this = pageUser;
            _this.fire('toast', { status: 'load' });
            axios.delete(`/users/user/${id}`)
                .then(res => {
                    _this.USER_LIST_APP(this.AppId);
                    _this.fire('toast', {
                        status: 'success', text: 'ลบข้อมูลสำเร็จ',
                        callback: () => {
                            _this.$$('panel-right').close();
                        }
                    });
                })
                .catch(err => {
                    console.log(err);
                })
        },
        USER_UPDATE: function (page,data) {
            console.log(page,data);
            var _this = window[page];
            _this.fire('toast', { status: 'load' });
            //data.scope = data.scope.split(",");

            axios.put(`/users/user`, data)
                .then(res => {
                    this.USER_LIST_APP(_this.AppId);
                    console.log('success');
                    _this.fire('toast', {
                        status: 'success', text: 'บันทึกสำเร็จ',
                        callback: () => {
                            _this.$$('panel-right').close();
                        }
                    });
                })
                .catch(err => {
                    console.log(err);
                })
        },
        USER_APP_INSERT: function (data) {
            var newData = {
                data : data
            }
            var _this = pageUser;

            _this.fire('toast',{status:'load'});
            axios.put('./roles/manageApps/', newData)
                .then((response) => {
                  _this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',
                    callback:()=>{
                        this.USER_SELECT_APP(_this.selectAppID)
                    }
                   });
                   
                })
                .catch((error) => {
                    console.log('error');
                    console.log(error);
                });
        }
    }

}