import axios from '../axios'

const initialState = {
    list:[],
    app_name:''
}


export function appRoleReducer(state = initialState,action){

    switch (action.type) {
        case 'APP_ROLE_LIST':
            return Object.assign({},state,{
                list:action.payload.roles,
                app_name:action.payload.app_name
            });
        default:
            return state
    }

}

export function appRoleAction(_this,store){

    return {
            APP_ROLE_LIST:function(id){
                // this.role_id = id;
                axios.get(`/roles/roles/${id}`)
                .then(res=>{
                    res.data.roles.push({
                        des:'',
                        role:''
                    })
                    console.log(res.data);
                    // res.data.role.push("");
                    store.dispatch({type:'APP_ROLE_LIST',payload:res.data})
                    _this.nylonVisible(true);
                })
                .catch(err=>{

                })
            },
            APP_ROLE_INSERT:function(_this,data){
                _this.fire('toast',{status:'load'});
                axios.put('./roles/roles',data)
                .then((response)=>{
                    _this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',
                      callback:()=>{
                          this.APP_ROLE_LIST(_this.getParam.AppId)
                      }
                     });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            APP_ROLE_UPDATE:function(_this,data){
            //     _this.fire('toast',{status:'load'});
            //    // data.scope = data.scope.split(",");
            //    // /apps/app
            //     var len=data.role.length;
            //     if(data.role[len-1]==""){
            //       //  data.role.pop(len);
            //        data.role.splice(len-1,1);
            //     }
            //     axios.put(`/apps/app`,data)
            //     .then(res=>{
            //         this.APP_ROLE_LIST(data.id);
            //         _this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',
            //             callback:()=>{
            //               //  _this.$$('panel-right').close();
            //             }
            //         });
            //     })
            //     .catch(err=>{
            //         console.log(err);
            //     })
            }
        }

}