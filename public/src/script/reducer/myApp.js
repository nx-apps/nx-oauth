import axios from '../axios'
import {commonAction} from '../config'

const initialState = {
    list:[],
    balanceList:[],
    select:{
        clientList:[]
    }
}

export function myAppReducer(state = initialState,action){

    switch (action.type) {
        case 'MY_APP_LIST':
            return Object.assign({},state,{list:action.payload});
        case 'MY_APP_BALANCE_LIST':
            return Object.assign({},state,{balanceList:action.payload});
        case 'MY_APP_SELECT':
            return Object.assign({},state,{select:action.payload});
        default:
            return state
    }

}

export function myAppAction(store){

    return [commonAction(),
        {

            MY_APP_LIST:function(id){
                axios.get(`/apps/appList`)
                .then(res=>{
                    store.dispatch({type:'MY_APP_LIST',payload:res.data})
                    this.nylonVisible(true);
                })
                .catch(err=>{
                    console.log(err);
                })
            },
            MY_APP_BALANCE_LIST:function(){
                axios.get(`/apps/balanceList`)
                .then(res=>{
                    store.dispatch({type:'MY_APP_BALANCE_LIST',payload:res.data})
                })
                .catch(err=>{
                    console.log(err);
                })

            },
            MY_APP_REQUEST:function(app_id){
                axios.post(`/apps/request`,{app_id})
                .then(res=>{    
                    //console.log(res.data)
                    this.MY_APP_LIST(this.getParam.id);
                    this.MY_APP_BALANCE_LIST(this.getParam.id);
                    this.$$('panel-right').close();
                })
                .catch(err=>{
                    console.log(err);
                })
            },
            MY_APP_SELECT:function(id){
                var panelRight = this.$$('panel-right');
                this.selected = 1;
                panelRight.title = "จัดการแอป"
                panelRight.open();

                //console.log(id)

                axios.get(`/apps/app/${id}`)
                .then(res=>{
                    
                    //var data = res.data;
                    //data.clientList = [];
                    store.dispatch({type:'MY_APP_SELECT',payload:res.data})
                    this.$$('panel-right').open();
                })
                .catch(err=>{
                    console.log(err);
                })

            },
            MY_APP_INSERT:function(data){

                if(typeof data.status_enable == "undefined") data.status_enable = false;
                if(typeof data.register_auto == "undefined") data.register_auto = false;

                this.fire('toast',{status:'load'});

                axios.post('/apps/app',data)
                .then(res=>{
                    this.MY_APP_LIST(this.getParam.id);
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
                axios.delete(`/apps/app/${id}`)
                .then(res=>{
                    this.MY_APP_LIST(this.getParam.id);
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

                axios.put(`/apps/app`,data)
                .then(res=>{
                    this.MY_APP_LIST(this.getParam.id);
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