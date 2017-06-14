var oauth = document.querySelector('#o-auth')
var mySrc = oauth.src.split('/')
var base = mySrc[0]+'//'+mySrc[2]


var myHead = document.querySelector('head')
var myScript = document.createElement('script')
myScript.src = base+'/bower_components/webcomponentsjs/webcomponents-lite.js'
myScript.onload = function(){

    var myLink = document.createElement('link')
    myLink.rel = 'import'
    myLink.href = base+'/bower_components/o-auth/o-auth.html'
    myHead.appendChild(myLink)
    
}
myHead.appendChild(myScript)



// try{
//     throw new Error()
// }
// catch(exc){
//     console.log(exc.sourceURL)
// }