import url from "./url.js";

function main(){
    var modern = true;

    var root = url.js;

    try{
        //1. is sticky positioning supported 
        if(!CSS.supports("position","sticky") && !CSS.supports("position", "-webkit-sticky") ){
            throw new Error("Sticky position not supported");
        }

        //2. ES6 supported
        var es6support = function(){
            try {
              new Function("(v = 0) => v");
              return true;
            }
            catch (e) {
              return false;
            }
        }();

        if(!es6support){
            throw new Error("ES6 features not supported");
        }
    }
    catch(e){
        modern = false;
    }
    finally{
        var s=document.createElement("script");
        var s0=document.getElementsByTagName("script")[0];
        s.src= modern ? root + "app-es6v2dot2.js" : root + "app-es5v2dot2.js";
        s.type="text/javascript";
        s0.parentNode.insertBefore(s,s0);
    }
}

document.addEventListener("DOMContentLoaded", main);