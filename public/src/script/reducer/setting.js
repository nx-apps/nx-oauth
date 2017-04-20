import axios from '../axios'
import {commonAction} from '../config'

const initialState = {
    list:[],
    select:{
        clientList:[]
    }
}

export function settingReducer(state = initialState,action){

    switch (action.type) {
        case 'SETTING_SELECT':
            return Object.assign({},state,{list:action.payload});
        case 'SETTING_UPDATE':
            return Object.assign({},state,{list:action.payload});
        default:
            return state
    }

}

export function settingAction(store){

    return [commonAction(),
        {
            SETTING_UPDATE:function(data){
                this.fire('toast',{status:'load'});

                axios.put('/setting/setting',data)
                .then(res=>{
                     this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',callback:function(){}});
                })
                .catch(err=>{
                    console.log(err);
                })

            },
            SETTING_SELECT:function(){
                axios.get('/setting/setting')
                .then(res=>{
                    store.dispatch({type:'SETTING_SELECT',payload:res.data})
                })
                .catch(err=>{
                    console.log(err);
                })
            }
        }
    ]

}