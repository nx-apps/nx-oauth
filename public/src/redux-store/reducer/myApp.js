import axios from '../axios'
import {commonAction} from '../config'

const initialState = {
    list:[]
}

export function myAppReducer(state = initialState,action){

    switch (action.type) {
        case 'MY_APP_LIST':
            return Object.assign({},state,{list:action.payload});
        case 'PROVIDER_SELECT':
            return Object.assign({},state,{select:action.payload});
        case 'PROVIDER_CLEAR_SELECT':
            return Object.assign({},state,{select:{}});
        default:
            return state
    }

}

export function myAppAction(store){

    return [commonAction(),
        {
            MY_APP_TEST:function(id){
                console.log(id);
            },
            MY_APP_LIST:function(){
                axios.get(`/users/user/1102001645128`)
                .then(res=>{
                    store.dispatch({type:'MY_APP_LIST',payload:res.data})
                })
                .catch(err=>{
                    console.log(err);
                })
            },
            MY_APP_LIST_REQUEST:function(){
                console.log('sssssss');

                axios.get(`/apps/balanceList/1102001645128`)
                .then(res=>{
                    store.dispatch({type:'MY_APP_LIST',payload:res.data})
                })
                .catch(err=>{
                    console.log(err);
                })

            },
            MY_APP_SELECT:function(id){
                axios.get(`/providers/provider/${id}`)
                .then(res=>{
                    store.dispatch({type:'PROVIDER_SELECT',payload:res.data})
                    this.$$('panel-right').open();
                })
                .catch(err=>{
                    console.log(err);
                })
            },
            MY_APP_CLEAR_SELECT:function(){
                store.dispatch({type:'PROVIDER_CLEAR_SELECT'})
            },
            MY_APP_INSERT:function(data){

                this.fire('toast',{status:'load'});
                data.scope = data.scope.split(",");

                axios.post(`/providers/provider`,data)
                .then(res=>{
                    this.PROVIDER_LIST();
                    this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',
                        callback:()=>{
                            this.$$('panel-right').close();
                        }
                    });
                })
                .catch(err=>{
                    console.log(err);
                })

            },
            MY_APP_DELETE:function(id){
                
                this.fire('toast',{status:'load'});

                axios.delete(`/providers/provider/${id}`)
                .then(res=>{
                    this.PROVIDER_LIST();
                    this.fire('toast',{status:'success',text:'ลบข้อมูลสำเร็จ',
                        callback:()=>{
                            this.$$('panel-right').close();
                        }
                    });
                })
                .catch(err=>{
                    console.log(err);
                })
            },
            MY_APP_UPDATE:function(data){
                this.fire('toast',{status:'load'});
                data.scope = data.scope.split(",");

                axios.put(`/providers/provider`,data)
                .then(res=>{
                    this.PROVIDER_LIST();
                    this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',
                        callback:()=>{
                            this.$$('panel-right').close();
                        }
                    });
                })
                .catch(err=>{
                    console.log(err);
                })
            }
        }
    ]

}