import axios from '../axios'

const initialState = {
    list: [],
    balanceList: [],
    select: {
        register_auto: false,
        status_enable: false
    },
    // dataClient:{},
    client: []
}

export function myAppReducer(state = initialState, action) {

    switch (action.type) {
        case 'MY_APP_LIST':
            return Object.assign({}, state, { list: action.payload });
        case 'MY_APP_CLEAR':
            return Object.assign({}, state, { select: action.payload });
        case 'MY_APP_BALANCE_LIST':
            return Object.assign({}, state, { balanceList: action.payload });
        case 'MY_APP_SELECT':
            return Object.assign({}, state, { select: action.payload });
        case 'MY_APP_SELECT_CLIENT':
            return Object.assign({}, state, { client: action.payload });
        default:
            return state
    }

}

export function myAppAction(store) {

    return {

        MY_APP_LIST: function (id) {
            var _this = pageMyApp;
            axios.get(`/apps/appList`)
                .then(res => {
                    store.dispatch({ type: 'MY_APP_LIST', payload: res.data })
                    _this.nylonVisible(true);
                })
                .catch(err => {
                    console.log(err);
                })
        },
        MY_APP_BALANCE_LIST: function () {
            axios.get(`/apps/balanceList`)
                .then(res => {
                    store.dispatch({ type: 'MY_APP_BALANCE_LIST', payload: res.data })
                })
                .catch(err => {
                    console.log(err);
                })

        },
        MY_APP_REQUEST: function (app_id) {
            var _this = pageMyApp;
            axios.post(`/apps/request`, { app_id })
                .then(res => {
                    //console.log(res.data)
                    this.MY_APP_LIST(_this.getParam.id);
                    this.MY_APP_BALANCE_LIST(_this.getParam.id);
                    _this.$$('panel-right').close();
                })
                .catch(err => {
                    console.log(err);
                })
        },
        MY_APP_SELECT: function (id) {
            var _this = pageMyApp;
            var panelRight = _this.$$('panel-right');
            _this.selected = 1;
            panelRight.title = "จัดการแอป"
            panelRight.open();

            //console.log(id)

            axios.get(`/apps/app/${id}`)
                .then(res => {

                    //var data = res.data;
                    //data.clientList = [];
                    store.dispatch({ type: 'MY_APP_SELECT', payload: res.data })
                    _this.$$('panel-right').open();
                })
                .catch(err => {
                    console.log(err);
                })

        },
        MY_APP_SELECT_CLIENT: function (id) {
            var _this = pageMyApp;
            axios.get('./apps/client?id=' + id)
                .then((response) => {
                    // console.log(response.data);
                    // this.selected = 3;
                    store.dispatch({ type: 'MY_APP_SELECT_CLIENT', payload: response.data })
                    // this.$$('panel-right').title = "จัดการ Client"
                    // this.$$('panel-right').open();
                })
                .catch((error) => {
                    console.log('error');
                    console.log(error);
                });
        },
        MY_APP_CLIENT_INSERT: function (data) {
            var _this = pageMyApp;
            _this.fire('toast',{status:'load'});
            axios.put('./apps/client', data)
                .then((response) => {
                    _this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',
                      callback:()=>{
                          _this.$$('panel-right').close();
                      }
                     });
                })
                .catch((error) => {
                    console.log('error');
                    console.log(error);
                });
        },
        MY_APP_INSERT: function (data) {
            var _this = pageMyApp;
            if (typeof data.status_enable == "undefined") data.status_enable = false;
            if (typeof data.register_auto == "undefined") data.register_auto = false;

            _this.fire('toast', { status: 'load' });
            //console.log(data);
            data.client = [];
            axios.post('/apps/app', data)
                .then(res => {
                    this.MY_APP_LIST(_this.getParam.id);
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
        MY_APP_DELETE: function (id) {
            var _this = pageMyApp;
            _this.fire('toast', { status: 'load' });
            axios.delete(`/apps/app/${id}`)
                .then(res => {
                    console.log('ss');
                    this.MY_APP_LIST(_this.getParam.id);
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
        MY_APP_UPDATE: function (data) {
            var _this = pageMyApp;
            _this.fire('toast', { status: 'load' });

            axios.put(`/apps/app`, data)
                .then(res => {
                    this.MY_APP_LIST(_this.getParam.id);
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
        MY_APP_CLEAR: function () {
            var obj = {
                register_auto: false,
                status_enable: false
            }
            store.dispatch({ type: 'MY_APP_CLEAR', payload: obj })
        }
    }

}