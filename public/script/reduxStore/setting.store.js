import axios from '../axios'

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

    return {
            SETTING_UPDATE:function(data){
                var _this = pageSetting;
                _this.fire('toast',{status:'load'});

                axios.put('/setting/setting',data)
                .then(res=>{
                     _this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',callback:function(){}});
                })
                .catch(err=>{
                    console.log(err);
                })

            },
            SETTING_SELECT:function(){
                var _this = pageSetting;
                axios.get('/setting/setting')
                .then(res=>{
                    store.dispatch({type:'SETTING_SELECT',payload:res.data})
                })
                .catch(err=>{
                    console.log(err);
                })
            }
        }

}