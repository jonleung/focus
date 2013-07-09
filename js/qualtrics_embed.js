//###############################################
// SETTINGS END

// Name Page
NAME_LABEL = "What is your full name?"

// Analytics Page
ANALYTICS_LABEL = "Has Analytics?"

THE_TOTAL_TIME = "The Total Time"
TOTAL_TIME_ON_TASK = "Total Time On Task"
TOTAL_TIME_OFF_TASK = "Total Time Off Task"
TOTAL_NUMBER_OF_TIMES_OFF_TASK = "Total Number of Times Off Task"
JSON_DUMP = "JSON Dump"


// SETTINGS START
//###############################################

afterSubmit = false
isFocused = true

// Analytics Page Question

// Cookie Names
DISTRACTED = "distracted";
FOCUSED = "focused";
EVENTS_ARRAY = "myEventsArray";
NOT_FIRST_LAUNCH = "notFirstRun";
START_TIME = "startTime";

(function(){function e(e,t){var n=document.createElement("script");n.type="text/javascript";if(n.readyState){n.onreadystatechange=function(){if(n.readyState=="loaded"||n.readyState=="complete"){n.onreadystatechange=null;t()}}}else{n.onload=function(){t()}}n.src=e;document.getElementsByTagName("head")[0].appendChild(n)}e("https://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js",function(){
  $.noConflict();
  jQuery(function() {

    //#################################
    // Libraries

    // JQuery Cookie
    (function(e){if(typeof define==="function"&&define.amd){define(["jquery"],e)}else{e(jQuery)}})(function(e){function n(e){return e}function r(e){return decodeURIComponent(e.replace(t," "))}function i(e){if(e.indexOf('"')===0){e=e.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,"\\")}try{return s.json?JSON.parse(e):e}catch(t){}}var t=/\+/g;var s=e.cookie=function(t,o,u){if(o!==undefined){u=e.extend({},s.defaults,u);if(typeof u.expires==="number"){var a=u.expires,f=u.expires=new Date;f.setDate(f.getDate()+a)}o=s.json?JSON.stringify(o):String(o);return document.cookie=[s.raw?t:encodeURIComponent(t),"=",s.raw?o:encodeURIComponent(o),u.expires?"; expires="+u.expires.toUTCString():"",u.path?"; path="+u.path:"",u.domain?"; domain="+u.domain:"",u.secure?"; secure":""].join("")}var l=s.raw?n:r;var c=document.cookie.split("; ");var h=t?undefined:{};for(var p=0,d=c.length;p<d;p++){var v=c[p].split("=");var m=l(v.shift());var g=l(v.join("="));if(t&&t===m){h=i(g);break}if(!t){h[m]=i(g)}}return h};s.defaults={};e.removeCookie=function(t,n){if(e.cookie(t)!==undefined){e.cookie(t,"",e.extend({},n,{expires:-1}));return true}return false}})
    jQuery.cookie.json = true;

    // Mixpanel MIXPANEL
    (function(e,b){if(!b.__SV){var a,f,i,g;window.mixpanel=b;a=e.createElement("script");a.type="text/javascript";a.async=!0;a.src=("https:"===e.location.protocol?"https:":"http:")+'//cdn.mxpnl.com/libs/mixpanel-2.2.min.js';f=e.getElementsByTagName("script")[0];f.parentNode.insertBefore(a,f);b._i=[];b.init=function(a,e,d){function f(b,h){var a=h.split(".");2==a.length&&(b=b[a[0]],h=a[1]);b[h]=function(){b.push([h].concat(Array.prototype.slice.call(arguments,0)))}}var c=b;"undefined"!== typeof d?c=b[d]=[]:d="mixpanel";c.people=c.people||[];c.toString=function(b){var a="mixpanel";"mixpanel"!==d&&(a+="."+d);b||(a+=" (stub)");return a};c.people.toString=function(){return c.toString(1)+".people (stub)"};i="disable track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config people.set people.set_once people.increment people.append people.track_charge people.clear_charges people.delete_user".split(" ");for(g=0;g<i.length;g++)f(c,i[g]); b._i.push([a,e,d])};b.__SV=1.2}})(document,window.mixpanel||[]); mixpanel.init("31d614cf84200ea10f382c62ffa26e58");

      // Mixpanel Helpers

      var login = function(uid) {
        // mixpanel.alias(uid)
        mixpanel.name_tag(uid)
        mixpanel.identify(uid)
        mixpanel.people.set({
          "$email": uid,
          "$last_login": new Date(),    
        });
      }

      var track = function (action, params) {
        console.log("track: " + action)
        console.log(params)
        console.log("\n")
        mixpanel.track(action, params);
      }

    //#################################
    // Helpers

    function msToStr (ms) {
      var x = ms / 1000
      // var s = Math.round(x % 60)
      // x /= 60
      // var m = Math.floor(x % 60)
      // x /= 60
      // var h = x % 24

      return x.toString()//m + "m " + s + "s "; //'just now' //or other string you like;
    }


    var setHash = function(string) {
      window.location.hash = string
    }

    var getHash = function() {
      return window.location.hash.substring(1)
    }

    var setStartTime = function() {
      var date = new Date()
      jQuery.cookie(START_TIME, date.getTime())
    }

    var getStartTime = function() {
      return new Date( jQuery.cookie(START_TIME) )
    }

    var getCurTime = function() {
      return new Date();
    }

    var clearStartTime = function() {
      jQuery.removeCookie(START_TIME)
    }

    var getPageId = function () {
      var pageId = "none";
      if (jQuery('label.QuestionText.BorderColor div span').length > 0) {
        pageId = jQuery('label.QuestionText.BorderColor div span').text();
      }
      return pageId;
    }

    var getProblemSetId = function () {
      var problemSetId = "none";
      if (jQuery("input#surveyID").length > 0) {
        problemSetId = jQuery("input#surveyID").val();
      }
      return problemSetId;
    }

    //#################################
    // Initializers

    var initEventsArray = function() {
      if (jQuery.cookie(EVENTS_ARRAY) == undefined) {
        jQuery.cookie(EVENTS_ARRAY, []) 
      }
    }

    var initTime = function() {
      if ( getHash() === NOT_FIRST_LAUNCH ) {
        // NOT First Launch
      }
      else {
        // FIRST Launch
        track("launch", {})
        clearEventsArray();
        clearCookies();
        setStartTime();
        console.log(getStartTime())
        setHash(NOT_FIRST_LAUNCH);
      }
    }
   
    //#################################
    // Event Logging

    var clearEventsArray = function() {
      jQuery.cookie(EVENTS_ARRAY, [])
    }

    clearCookies = function() {
      clearStartTime()
      clearEventsArray()
    }

    var pushEvent = function(params) {
      //the names of these parameters match the rails model.
      //if you change these you must change the corresponding rails model
      var eventsArray = jQuery.cookie(EVENTS_ARRAY)
      var e = {
        "timestamp": (new Date).toUTCString(),
        "focus_type": params.type,
        "page": params.page_id,
        "problem_set": params.problem_set_id
      }
      var url = "http://duckworthqualtrics.herokuapp.com/focus_events"
      params={};
      params.focus_event={};
      params.focus_event=e;
      jQuery.post(url,params);
      eventsArray.push(e);
      jQuery.cookie(EVENTS_ARRAY, eventsArray);
    }

    var popEvent = function() {
      var eventsArray = jQuery.cookie(EVENTS_ARRAY)
      eventsArray.pop()
      jQuery.cookie(EVENTS_ARRAY, eventsArray)
    }

    var getEvents = function() {
      return jQuery.cookie(EVENTS_ARRAY)
    }

    //#################################
    // English Logging

    var getCurDateString = function() {
      var curTime = new Date();

      var timeDelta = curTime.getTime() - getStartTime();
      var readableTimeDelta = millisecondsToStr( timeDelta )
      return readableTimeDelta
    }

    function millisecondsToStr (ms) {
      var x = ms / 1000
      var s = Math.round(x % 60)
      x /= 60
      var m = Math.floor(x % 60)
      x /= 60
      var h = x % 24

      return m + "m " + s + "s "; //'just now' //or other string you like;
    }

    //#################################
    // Window Switching

    var log = function(string) {
      params = {}
      params.type = string;
      params.page_id = getPageId();
      params.problem_set_id = getProblemSetId();
      pushEvent(params);

      console.log( getCurDateString() + ": " + string )
      console.log( jQuery.cookie(EVENTS_ARRAY) )
      console.log()

      track(string, {})

      // calculateAndSetQualtrics()
    }
    
    // Main
    jQuery(window).focus(function() {
      log(FOCUSED)
    });

    prevTime = 0
    jQuery(window).blur(function(e) {
      var curTime = new Date().getTime()
      if ( (curTime - prevTime) > 100) {
        log(DISTRACTED)
      }
      prevTime = curTime
    });

    var init = function() {
      initEventsArray();
      initTime();
    }

    //###################################
    // Qualtrics Manipulaion

    var advanceQualtrics = function() {
      Qualtrics.SurveyEngine.navClick(null, 'NextButton')
    }

    var setText = function(key, value) {
      var input = jQuery('label:contains('+key+')').parent().parent().find(".QuestionBody input")
      input.val(value)
    }

    var getText = function(key) {
      var input = jQuery('label:contains('+key+')').parent().parent().find(".QuestionBody input")
      return input.val()
    }

    var calculateAndSetQualtrics = function() {
      setText(ANALYTICS_LABEL, "Yes")

      var totalTime = getCurTime() - getStartTime()
      setText(THE_TOTAL_TIME, msToStr( totalTime ) )

      var totalTimeOnTask = 0
      var totalTimeOffTask = 0

      var numEvents = getEvents().length
      var events = getEvents()
      if (numEvents == 0) {
        // That's fine, they were never distracted
      }
      else if (numEvents == 1) {
        if (events[0].type === DISTRACTED) {
          totalNumTimesOffTask++
        }
      }
      else {
        for(var i=1; i<getEvents().length; i++) {
          // debugger
          var b = events[i]
          var a = events[i-1]

          var delta = b.timestamp - a.timestamp
          if (a.type === FOCUSED && b.type === DISTRACTED) {
            totalTimeOnTask += delta
          }
          else if (a.type === DISTRACTED && b.type === FOCUSED) {
            totalTimeOffTask += delta
          }
          else {
            // alert("ERROR! You cannot have " + a.type + " " + b.type + " in a row!")
          }
        }
      }
      setText(TOTAL_TIME_ON_TASK, msToStr( totalTimeOnTask ) )
      setText(TOTAL_TIME_OFF_TASK, msToStr( totalTimeOffTask ) )

      var totalNumTimesOffTask = 0
      jQuery.each(events, function(i, e) {
        if (e.type === DISTRACTED) {
          totalNumTimesOffTask++
        }
      })

      setText(TOTAL_NUMBER_OF_TIMES_OFF_TASK, totalNumTimesOffTask )

      setText(JSON_DUMP, JSON.stringify(events) )
    }

    var submit = function() { 
      console.log("submit")     
      calculateAndSetQualtrics();
      advanceQualtrics();
      clearCookies();
      return true
    }

    var fakeUpdate = function() {
      var eventsArray = jQuery.cookie(EVENTS_ARRAY)
      if (eventsArray.length == 0) {
        type = FOCUSED
      }
      else {
        var lastEvent = eventsArray[eventsArray.length-1]
        if (lastEvent.type === FOCUSED) {
          type = FOCUSED
        }
        else {
          type = DISTRACTED
        }
      }
      console.log(type)

      var params = {}
      if (type == FOCUSED) {
        params.type = DISTRACTED;
        params.page_id = getPageId();
        params.problem_set_id = getProblemSetId();
        pushEvent(params);
      } else {
        params.type = FOCUSED;
        params.page_id = getPageId();
        params.problem_set_id = getProblemSetId();
        pushEvent(params);
      }

      calculateAndSetQualtrics()

      popEvent()
    }

    if ( jQuery('label:contains("'+NAME_LABEL+'")').length ) {
      jQuery('#NextButton').click(function(e) {
        var name = getText(NAME_LABEL)
        // debugger
        login(name)
      })
    }

    if ( jQuery.find('label:contains("'+ANALYTICS_LABEL+'")').length ) {
      if (window.location.origin == "https://upenn.us2.qualtrics.com" ) {
        submit()
      }
      setInterval(fakeUpdate, 1000)

    }

    init();

    /*
      Time on Task
      Time Off Task
      Total Number of Shifts
      Timestamps of Shifts

      figure out the case that they closed it and opened it again from the original link.

      figure out time per question (latch on to the next button).
    */


  });

})})()


/*

Todo:
Make Signin with Name











*/