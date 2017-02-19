import axios from '../axios'
import {commonAction} from '../config'

const initialState = {
    list:[],
    select:{}
}


export function appRoleReducer(state = initialState,action){

    switch (action.type) {
        case 'APPROLE_LIST':
            return Object.assign({},state,{list:action.payload});
        case 'APPROLE_SELECT':
            return Object.assign({},state,{select:action.payload});
        case 'APPROLE_CLEAR_SELECT':
            return Object.assign({},state,{select:{}});
        default:
            return state
    }

}

export function appRoleAction(store){

    return [commonAction(),
        {
            APPROLE_LIST:function(){
                axios.get('/apps/roles')
                .then(res=>{
                    store.dispatch({type:'APPROLE_LIST',payload:res.data})
                })
                .catch(err=>{

                })
            },
            APPROLE_SELECT:function(id){
                axios.get('/apps/roles/${id}')
                .then(res=>{
                    store.dispatch({type:'APPROLE_SELECT',payload:res.data})
                    this.$$('panel-right').open();
                })
                .catch(err=>{
                    console.log(err);
                })
            },
            APPROLE_CLEAR_SELECT:function(){
                store.dispatch({type:'APPROLE_CLEAR_SELECT'})
            },
            APPROLE_INSERT:function(data){

                this.fire('toast',{status:'load'});
                data.scope = data.scope.split(",");

                axios.post('/apps/roles',data)
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
            APPROLE_DELETE:function(id){
                
                this.fire('toast',{status:'load'});

                axios.delete(`/apps/role/${id}`)
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
            APPROLE_UPDATE:function(data){
                this.fire('toast',{status:'load'});
                data.scope = data.scope.split(",");

                axios.put(`/apps/role`,data)
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