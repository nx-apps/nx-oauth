import axios from '../axios'

const initialState = {
    list: []
}

export function appConnectReducer(state = initialState, action) {

    switch (action.type) {
        case 'APP_CONNECT_LIST':
            return Object.assign({}, state, { list: action.payload });
        default:
            return state
    }

}

export function appConnectAction(store) {

    return {
        APP_CONNECT_LIST: function (id) {
            var _this = pageAppConnect;
            axios.get(`/apps/connects/${id}`)
                .then(res => {
                    store.dispatch({ type: 'APP_CONNECT_LIST', payload: res.data })
                    _this.nylonVisible(true);
                })
                .catch(err => {

                })
        },
        APP_CONNECT_UPDATE: function (data) {
            var _this = pageAppConnect;
            _this.fire('toast', { status: 'load' });
            var conns=[]
            data.connections.forEach(function (conn) {
                   if (conn.status == true) {
                      conns.push(conn.id);
                   }
            });
            data.connections=conns;
            axios.put(`/apps/app`, data)
                .then(res => {
                    this.APP_CONNECT_LIST(data.id);
                    _this.fire('toast', {
                        status: 'success', text: 'บันทึกสำเร็จ',
                        callback: () => {
                            //_this.$$('panel-right').close();
                        }
                    });
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }

}