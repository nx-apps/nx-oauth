var oauth = {
  urlParams: {},
  _getParam: function () {
    var match,
      pl = /\+/g,  // Regex for replacing addition symbol with a space
      search = /([^&=]+)=?([^&]*)/g,
      decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
      query = window.location.search.substring(1);

    this.urlParams = {};
    while (match = search.exec(query))
      this.urlParams[decode(match[1])] = decode(match[2]);
  },

  _CallAPI: function (uri, callback) {
    var xhr = new XMLHttpRequest();

    xhr.onload = function () {
      console.log(xhr.status);
      console.log(xhr.getAllResponseHeaders());
      if (xhr.status == 401) {

        callback({ error: 401 });
      } else {
        callback(this.response);
      }

    }
    xhr.open("GET", uri);
    var jwt = this._getCookie("JWT");
    //var token = this._getCookie("token");
    xhr.withCredentials = false;
    xhr.setRequestHeader("X-CLIENT-ID", "{OAUTH_CLIENT_ID}");
    xhr.setRequestHeader("X-CLIENT-KEY", "{OAUTH_CLIENT_KEY}");
    if (jwt) {
      xhr.setRequestHeader("Authorization", "JWT " + jwt);
    }

    // else if (token) {
    // xhr.setRequestHeader("Authorization", "TOKEN " + token);
    // }


    xhr.responseType = "json";
    xhr.send();
  },
  _setCookie: function (cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  },

  _getCookie: function (cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  },

  _deleteCookie: function (name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  },


  Login: function (callback) {
    var self = this;
    this._getParam();
    this._setCookie("X-CLIENT-ID", "{OAUTH_CLIENT_ID}", 1);
    this._setCookie("X-CLIENT-KEY", "{OAUTH_CLIENT_KEY}", 1);
    //var x_token=getResponseHeader
    console.log(this.urlParams.token);
    if (this.urlParams.token) {
      this._setCookie("JWT", this.urlParams.token, 1);
      // window.location.href = "/";
    }
    var c = this._getCookie("JWT");
    if (c) {
      var uri = "{OAUTH_HOST}/api/oauth/userinfo";
      this._CallAPI(uri, function (data) {
        if (data.error) {
          window.location.href = "{OAUTH_HOST}/api/oauth/login/{OAUTH_CLIENT_ID}/{OAUTH_CLIENT_KEY}";
        } else {
          self._setCookie("JWT", data.jwt, 1);
          callback(data.user);
        }
      });
    } else {
      console.log(window.parent.location);
      window.location.href = "{OAUTH_HOST}/api/oauth/login/{OAUTH_CLIENT_ID}/{OAUTH_CLIENT_KEY}";
    }
  },

  Logout: function () {
    var self = this;
    this._CallAPI("{OAUTH_HOST}/api/oauth/logout", function (data) {
      // self._deleteCookie();
      self._deleteCookie("JWT");
      window.location.href = "{OAUTH_APP_LOGOUT}";
    });

  }

}
