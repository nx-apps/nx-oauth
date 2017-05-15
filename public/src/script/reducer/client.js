import axios from '../axios'
import { commonAction } from '../config'

const initialState = {
    data:{},
    list:[]
}

export function clientReducer(state = initialState, action) {

    switch (action.type) {
        case 'CLIENT_GET_LIST':
            return Object.assign({}, state, { list: action.payload });
        case 'CLIENT_CLEAR_DATA':
            return Object.assign({}, state, { data: action.payload });
        case 'CLIENT_SELECT':
            return Object.assign({}, state, { data: action.payload });
        default:
            return state
    }

}

export function clientAction(store) {

    return [commonAction(),
    {

        CLIENT_GET_LIST: function (id) {
            axios.get('./apps/clients?id=' + id)
                .then(res => {
                    store.dispatch({ type: 'CLIENT_GET_LIST', payload: res.data })
                    // this.nylonVisible(true);
                })
                .catch(err => {
                    console.log(err);
                })
        },
        CLIENT_SELECT:function(id){
            return new Promise((res,rej)=>{
                axios.get('./apps/clientsAlone?id='+id)
                .then((response)=>{
                    var newItem = response.data;
                    var newDate = newItem.exp_date.split('T');
                    newItem.exp_date = newDate[0];
                    // console.log(newItem);
                    res(response.data);
                    store.dispatch({ type: 'CLIENT_SELECT', payload: newItem })
                })
                .catch((error)=>{
                    rej(error);
                });
            })
        },
        CLIENT_INSERT: function(data){
            return axios.post('./apps/clients',data)
        },
        CLIENT_CLEAR_DATA: function(data){
            return new Promise((res,rej)=>{
                res(res);
                store.dispatch({ type: 'CLIENT_CLEAR_DATA', payload: {} })
            })
        },
        CLIENT_DELETE:function(id){
            var newItem = {
                id:id
            }
            console.log(JSON.stringify(newItem));
            // console.log(newItem);
            return axios.delete('./apps/clients/'+id)
        },
        CLIENT_UPDATE:function(data){
            return axios.put('./apps/clients',data)
        }
      
    }
    ]

}