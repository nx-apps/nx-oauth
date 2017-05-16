import axios from '../axios'

const initialState = {
    list: [],
    updates: [],
    deletes: []
}


export function appUserReducer(state = initialState, action) {

    switch (action.type) {
        case 'APP_USER_LIST':
            return Object.assign({}, state, { list: action.payload });
        case 'APP_USER_DELETE':
            state.deletes.push(action.payload)
            return Object.assign({}, state, { deletes: state.deletes });
        case 'APP_USER_UPDATE':
            state.updates.push(action.payload)
            return Object.assign({}, state, { updates: state.updates });
        case 'APP_USER_CLEAR':
            return Object.assign({}, state, { deletes: [], updates: [] });
        default:
            return state
    }

}

export function appUserAction(store) {

    return {
        APP_USER_LIST: function (id) {
            var _this = pageAppUser;
            // console.log('APP_USER_LIST');
            axios.get(`/apps/users/${id}`)
                .then(res => {
                    console.log(res.data);
                    // res.data.role.push("");
                    store.dispatch({ type: 'APP_USER_LIST', payload: res.data })
                    store.dispatch({ type: 'APP_USER_CLEAR' });
                    _this.nylonVisible(true);
                })
                .catch(err => {

                })
        },

        APP_USER_UPDATE: function (data) {
            store.dispatch({ type: 'APP_USER_UPDATE', payload: data });
        },

        APP_USER_DELETE: function (data) {
            store.dispatch({ type: 'APP_USER_DELETE', payload: data });
        },


        APP_USER_SAVE: function (data, updates, deletes) {
            var _this = pageAppUser;
            // console.log(deletes);
            _this.fire('toast', { status: 'load' });
            // var user_dels=[];
            // console.log(updates);
            var newUpdate = updates.map((item)=>{
                let data = {
                    user_apps_id: item.user_apps_id,
                    role : item.role,
                    status : item.status
                }
                return data;
            })
            var newData = {
                updates: newUpdate,
                deletes:deletes
            }
             console.log(newData);
            // var updates_ = [];
            // updates.forEach(function (user) {
            //     var u = {
            //         id: user.id,
            //         app_id: user.app_id,
            //         role: user.role,
            //         status: user.status,
            //         uid: user.uid,
            //     }
            //     updates_.push(u);
            // });
            // var user_apps = {
            //     updates: updates_,
            //     deletes: deletes
            // }
            // console.log(user_apps.updates);

            axios.put(`/apps/users`, newData)
                .then(res => {
                    this.APP_USER_LIST(data);
                    _this.fire('toast', {
                        status: 'success', text: 'บันทึกสำเร็จ',
                        callback: () => {
                            //  this.$$('panel-right').close();
                            //store.dispatch({ type: 'APP_USER_CLEAR' });
                        }
                    });
                })
                .catch(err => {
                    console.log({err});
                })
        }
    }

}