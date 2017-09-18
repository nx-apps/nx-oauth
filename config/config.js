var config = {
  
      host: "http://127.0.0.1:8080",
      appId: "d8fcffc5-d1ab-40f1-ac63-d2643d7b9464",
      appKey: "5fc02522e60958787b8298067513c5f4b44ca78a",
      database: {
        host: 'rdb.codeunbug.com',
        port: 28015
      },
  
      ws:{
         url: 'ws://128.199.230.199/ws',
         realm: 'realm1'
      },
  
      oauth: {
        facebook: {
          provoider: 'facebook',
          clientId: '157316171444270',
          clientSecret: '71c15fa338a11f411fc6432b04cad3ca',
          callbackURL: 'http://localhost:3000/api/oauth/facebook/callback'
        },
        google: {
          provoider: 'google',
          clientId: '464475406694-skti62k23di8uemcanuc6h6ah5nnl55a.apps.googleusercontent.com',
          clientSecret: '24WehldQ1ZPo2hXCXmxI_FFg',
          callbackURL: 'http://localhost:3000/api/oauth/google/callback'
        }
      },
      java: true,
      jdbc: [
        {
          name: "mysql",
          driver: "com.mysql.jdbc.Driver",
          url: "jdbc:mysql://db.codeunbug.com:3306/rmut_expert_db",
          user: "xx",
          password: "xx"
        },
        {
          name: "mssql",
          driver: "com.microsoft.sqlserver.jdbc.SQLServerDriver",
          url: "jdbc:sqlserver://202.44.34.86:1433;databaseName=RiceDB",
          user: "xx",
          password: "xx"
        },
        {
          name: "oracle",
          driver: "oracle.jdbc.OracleDriver",
          url: "jdbc:oracle:thin:@25.32.200.27:1521:gl3d",
          user: "xx",
          password: "xx"
        }
      ]
    
  };
  
  module.exports = config;