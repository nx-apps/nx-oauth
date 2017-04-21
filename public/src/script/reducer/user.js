import axios from '../axios'
import { commonAction } from '../config'

const initialState = {
    list: [],
    select: {},
    data: {
        local: {}
    }
}

export function userReducer(state = initialState, action) {

    switch (action.type) {
        case 'USER_LIST':
            return Object.assign({}, state, { list: action.payload });
        case 'USER_LIST_APP':
            return Object.assign({}, state, { list: action.payload });
        case 'USER_SELECT':
            return Object.assign({}, state, { data: action.payload });
        case 'USER_CLEAR_SELECT':
            return Object.assign({}, state, { data: { status: false, local: {} } });
        default:
            return state
    }

}

export function userAction(store) {

    return [commonAction(),
    {
        USER_TEST: function (id) {
            console.log(id);
        },
        USER_LIST: function () {
            axios.get('/users/info')
                .then(res => {
                    store.dispatch({ type: 'USER_LIST', payload: res.data })
                    this.nylonVisible(true);
                })
                .catch(err => {

                })
        },
        USER_LIST_APP: function (id) {
            this.AppId = id;
            axios.get('./users/userList?app_id='+id)
                .then((response) => {
                   store.dispatch({ type: 'USER_LIST_APP', payload: response.data })
                })
                .catch((error) => {
                    console.log('error');
                    console.log(error);
                });
        },
        USER_SELECT: function (id) {
            axios.get(`/users/info/${id}`)
                .then(res => {
                    store.dispatch({ type: 'USER_SELECT', payload: res.data })
                    this.$$('panel-right').open();
                })
                .catch(err => {
                    console.log(err);
                })
        },
        USER_CLEAR_SELECT: function () {
            store.dispatch({ type: 'USER_CLEAR_SELECT' })
        },
        USER_INSERT: function (data) {

            this.fire('toast', { status: 'load' });
            // data.scope = data.scope.split(",");

            axios.post(`/users/user`, data)
                .then(res => {
                    this.USER_LIST_APP(this.AppId);
                    // this.USER_LIST();
                    this.fire('toast', {
                        status: 'success', text: 'บันทึกสำเร็จ',
                        callback: () => {
                            this.$$('panel-right').close();
                        }
                    });
                })
                .catch(err => {
                    console.log(err);
                })
        },
        USER_DELETE: function (id) {
            this.fire('toast', { status: 'load' });
            axios.delete(`/users/user/${id}`)
                .then(res => {
                    this.USER_LIST_APP(this.AppId);
                    this.fire('toast', {
                        status: 'success', text: 'ลบข้อมูลสำเร็จ',
                        callback: () => {
                            this.$$('panel-right').close();
                        }
                    });
                })
                .catch(err => {
                    console.log(err);
                })
        },
        USER_UPDATE: function (data) {
            this.fire('toast', { status: 'load' });
            //data.scope = data.scope.split(",");

            axios.put(`/users/user`, data)
                .then(res => {
                    this.USER_LIST_APP(this.AppId);
                    this.fire('toast', {
                        status: 'success', text: 'บันทึกสำเร็จ',
                        callback: () => {
                            this.$$('panel-right').close();
                        }
                    });
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }
    ]

}