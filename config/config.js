var config = {

  development: {
    host:"https://localhost:3000",
    server: {
      port: 4000,
      cluster: 1
    },
    database: {
      max: 10,
     // servers: [
      //  {
           host: 'rdb.codeunbug.com', port: 28015 ,user:"admin",password:"next@2017",
         // }
    //  ],
      db: 'lms'
    },

    h2: {
      enable:true,
      ssl: {
        key: "/ssl/server.key",
        cert: "/ssl/server.crt"
      },
      pusher: "auto",
    },
 

    oauth: {
      local: {
        provider: 'local'
      },
      jwt: {
        provider: 'jwt',
        clientSecret: '123456',
        timeout: '1d'
      },
      facebook: {
        provoider: 'facebook',
        clientId: '157316171444270',
        clientSecret: '71c15fa338a11f411fc6432b04cad3ca',
        callbackURL: 'https://localhost:3000/oauth/facebook/callback'
      },
      google: {
        provoider: 'google',
        clientId: '464475406694-skti62k23di8uemcanuc6h6ah5nnl55a.apps.googleusercontent.com',
        clientSecret: '24WehldQ1ZPo2hXCXmxI_FFg',
        callbackURL: 'https://localhost:3000/oauth/google/callback'
      }
    },
    java: true,
    jdbc: [
      {
        name: "mysql",
        driver: "com.mysql.jdbc.Driver",
        url: "jdbc:mysql://db.codeunbug.com:3306/rmut_expert_db",
        user: "test",
        password: "If1C5B13eeNWvyCr"
      },
      {
        name: "mssql",
        driver: "com.microsoft.sqlserver.jdbc.SQLServerDriver",
        url: "jdbc:sqlserver://202.44.34.86:1433;databaseName=RiceDB",
        user: "riceuser",
        password: "l2ice2015"
      },
      {
        name: "oracle",
        driver: "oracle.jdbc.OracleDriver",
        url: "jdbc:oracle:thin:@25.32.200.27:1521:gl3d",
        user: "wzeB505",
        password: "acreporter"
      }
    ]
  },

  production: {
    server: {
      port: 8080,
      cluster: 1
    },
    database: {
      servers: [
        { host: 'rdb.codeunbug.com', port: 28015 }
      ],
      db: 'oauth'
    },

    pusher: "auto",

    oauth: [
      {
        provider: 'local'
      },
      {
        provoider: 'facebook',
        clientId: '1438197499538604',
        clientSecret: 'd39bcc969fab3f784ec24c301535b7a4',
        callbackURL: 'http://localhost:8080/oauth/facebook/callback'
      },
      {
        provoider: 'google',
        clientId: '464475406694-skti62k23di8uemcanuc6h6ah5nnl55a.apps.googleusercontent.com',
        clientSecret: '24WehldQ1ZPo2hXCXmxI_FFg',
        callbackURL: 'http://localhost:8080/oauth/google/callback'
      }
    ]
  }

};

module.exports = config[process.env.NODE_ENV || 'development'];