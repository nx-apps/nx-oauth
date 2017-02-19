import axios from '../axios'
import { commonAction } from '../config'

const initialState = {
    list: [],
    select: {}
}

export function connectionReducer(state = initialState, action) {

    switch (action.type) {
        case 'CONNECTION_LIST':
            return Object.assign({}, state, { list: action.payload });
        case 'CONNECTION_SELECT':
            return Object.assign({}, state, { select: action.payload });
        case 'CONNECTION_CLEAR_SELECT':
            return Object.assign({}, state, { select: {} });
        default:
            return state
    }

}

export function connectionAction(store) {

    return [commonAction(),
    {
        CONNECTION_LIST: function (id) {
            axios.get(`/connections/${id}`)
                .then(res => {
                    store.dispatch({ type: 'CONNECTION_LIST', payload: res.data })
                })
                .catch(err => {

                })
        },
        CONNECTION_UPDATE: function (data) {
            this.fire('toast', { status: 'load' });

            axios.put(`/apps/app`, data)
                .then(res => {
                    this.CONNECTION_LIST(data.id);
                    this.fire('toast', {
                        status: 'success', text: 'บันทึกสำเร็จ',
                        callback: () => {
                            //this.$$('panel-right').close();
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