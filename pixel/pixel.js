'use strict';

/**
 * Pixel.js, js file to be inserted for every client
 *   Dependent upon:
 *     aja.js | https://github.com/krampstudio/aja.js
 *     cookie-monster.js | https://github.com/jgallen23/cookie-monster
 *     http://stackoverflow.com/questions/9514179/how-to-find-the-operating-system-version-using-javascript
 *  
 * Following has been distributed in below Modules
 * 
 *   - Inbuilt Core Wrappers
 *     - Constants
 *     - Textfield Emoticons
 *     - Attachments
 *     - Ajax and Socket.io settings
 *     - DOM Manipulation Methods
 *     
 *   - PixelSettings
 *   
 *   - HTML and CSS Generation
 *   
 *   - Conversation Module
 *   
 */

/**********************
 *** CORE: CONSTANTS ****
 **********************/

var pixel = pixel || {};
pixel.constants = {
  cookie: {
    id: '__PIXEL_USER'
  },
  url: {
    base: 'http://localhost:9000/api/',
    customer: 'customers',
    message: 'messages'
  },
  namespace: 'pixel',
  messages: {
    noSettings: 'Please read the docs and install pixel tracker again',
    noClientId: 'Please make sure that you have enable client id and you have the correct clientId',
    noUserId: 'No user id has been installed',
    getCustFailed: 'Get Customer Called failed',
  }
}

 /**********************
 *** CORE: UTILITIES
 **********************/

// templater('{{ name }}', { name: 'Jay'}) -> 'Jay'
pixel.templater = function(html){
  return function(data){
    for(var x in data){
      var re = "{{\\s?" + x + "\\s?}}";
      html = html.replace(new RegExp(re, "ig"), data[x]);
    }
    return html;
  };
};

// To be used later for tracking 
// Will load the corresponding 1x1 gif with utm parameters
pixel.tracker = function(clientId, params) {
  
}

/**
 * Universal Logger for pixel
 * @param  {String} msg   What to log
 * @param  {Boolean} bool  Whether to show to the user
 * @param  {Boolean} track Always track
 * @return {String}       
 */
pixel.logger = function(msg, bool, track) {
 if (bool && console && console.info) {
  console.info('Intercom Message', msg);
 }

 if (track !== false) {
  pixel.tracker();
 }
}

// Creates A Fragment of html to be inserted
pixel.createFrag = function(htmlStr) {
  var frag = document.createDocumentFragment(),
      temp = document.createElement('div');
  temp.innerHTML = htmlStr;
  while (temp.firstChild) {
      frag.appendChild(temp.firstChild);
  }
  return frag;
}

pixel.insertAfterBody = function(htmlStr) {
 document.body.insertAdjacentHTML('afterbegin', htmlStr);
}

pixel.cookie = monster;

// TODO: https://github.com/keithws/browser-report/blob/master/index.js
pixel.getClientDetails = function() {
  
  var unknown = '-';

  // screen
  var screenSize = '';
  if (screen.width) {
    var width = (screen.width) ? screen.width : '';
    var height = (screen.height) ? screen.height : '';
    screenSize += '' + width + " x " + height;
  }

  // browser
  var nVer = navigator.appVersion;
  var nAgt = navigator.userAgent;
  var browser = navigator.appName;
  var version = '' + parseFloat(navigator.appVersion);
  var majorVersion = parseInt(navigator.appVersion, 10);
  var nameOffset, verOffset, ix;

  // Opera
  if ((verOffset = nAgt.indexOf('Opera')) != -1) {
    browser = 'Opera';
    version = nAgt.substring(verOffset + 6);
    if ((verOffset = nAgt.indexOf('Version')) != -1) {
      version = nAgt.substring(verOffset + 8);
    }
  }
  // Opera Next
  if ((verOffset = nAgt.indexOf('OPR')) != -1) {
    browser = 'Opera';
    version = nAgt.substring(verOffset + 4);
  }
  // MSIE
  else if ((verOffset = nAgt.indexOf('MSIE')) != -1) {
    browser = 'Microsoft Internet Explorer';
    version = nAgt.substring(verOffset + 5);
  }
  // Chrome
  else if ((verOffset = nAgt.indexOf('Chrome')) != -1) {
    browser = 'Chrome';
    version = nAgt.substring(verOffset + 7);
  }
  // Safari
  else if ((verOffset = nAgt.indexOf('Safari')) != -1) {
    browser = 'Safari';
    version = nAgt.substring(verOffset + 7);
    if ((verOffset = nAgt.indexOf('Version')) != -1) {
      version = nAgt.substring(verOffset + 8);
    }
  }
  // Firefox
  else if ((verOffset = nAgt.indexOf('Firefox')) != -1) {
    browser = 'Firefox';
    version = nAgt.substring(verOffset + 8);
  }
  // MSIE 11+
  else if (nAgt.indexOf('Trident/') != -1) {
    browser = 'Microsoft Internet Explorer';
    version = nAgt.substring(nAgt.indexOf('rv:') + 3);
  }
  // Other browsers
  else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
    browser = nAgt.substring(nameOffset, verOffset);
    version = nAgt.substring(verOffset + 1);
    if (browser.toLowerCase() == browser.toUpperCase()) {
      browser = navigator.appName;
    }
  }
  // trim the version string
  if ((ix = version.indexOf(';')) != -1) version = version.substring(0, ix);
  if ((ix = version.indexOf(' ')) != -1) version = version.substring(0, ix);
  if ((ix = version.indexOf(')')) != -1) version = version.substring(0, ix);

  majorVersion = parseInt('' + version, 10);
  if (isNaN(majorVersion)) {
    version = '' + parseFloat(navigator.appVersion);
    majorVersion = parseInt(navigator.appVersion, 10);
  }

  // mobile version
  var mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(nVer);

  // cookie
  var cookieEnabled = (navigator.cookieEnabled) ? true : false;

  if (typeof navigator.cookieEnabled == 'undefined' && !cookieEnabled) {
    document.cookie = 'testcookie';
    cookieEnabled = (document.cookie.indexOf('testcookie') != -1) ? true : false;
  }

  // system
  var os = unknown;
  var clientStrings = [
    {s:'Windows 10', r:/(Windows 10.0|Windows NT 10.0)/},
    {s:'Windows 8.1', r:/(Windows 8.1|Windows NT 6.3)/},
    {s:'Windows 8', r:/(Windows 8|Windows NT 6.2)/},
    {s:'Windows 7', r:/(Windows 7|Windows NT 6.1)/},
    {s:'Windows Vista', r:/Windows NT 6.0/},
    {s:'Windows Server 2003', r:/Windows NT 5.2/},
    {s:'Windows XP', r:/(Windows NT 5.1|Windows XP)/},
    {s:'Windows 2000', r:/(Windows NT 5.0|Windows 2000)/},
    {s:'Windows ME', r:/(Win 9x 4.90|Windows ME)/},
    {s:'Windows 98', r:/(Windows 98|Win98)/},
    {s:'Windows 95', r:/(Windows 95|Win95|Windows_95)/},
    {s:'Windows NT 4.0', r:/(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/},
    {s:'Windows CE', r:/Windows CE/},
    {s:'Windows 3.11', r:/Win16/},
    {s:'Android', r:/Android/},
    {s:'Open BSD', r:/OpenBSD/},
    {s:'Sun OS', r:/SunOS/},
    {s:'Linux', r:/(Linux|X11)/},
    {s:'iOS', r:/(iPhone|iPad|iPod)/},
    {s:'Mac OS X', r:/Mac OS X/},
    {s:'Mac OS', r:/(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/},
    {s:'QNX', r:/QNX/},
    {s:'UNIX', r:/UNIX/},
    {s:'BeOS', r:/BeOS/},
    {s:'OS/2', r:/OS\/2/},
    {s:'Search Bot', r:/(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/}
  ];

  for (var id in clientStrings) {
    var cs = clientStrings[id];
    if (cs.r.test(nAgt)) {
      os = cs.s;
      break;
    }
  }

  var osVersion = unknown;

  if (/Windows/.test(os)) {
    osVersion = /Windows (.*)/.exec(os)[1];
    os = 'Windows';
  }

  switch (os) {
    case 'Mac OS X':
      osVersion = /Mac OS X (10[\.\_\d]+)/.exec(nAgt)[1];
      break;

    case 'Android':
      osVersion = /Android ([\.\_\d]+)/.exec(nAgt)[1];
      break;

    case 'iOS':
      osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
      osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
      break;
  }

  var flashVersion = 'no check';
  if (typeof swfobject != 'undefined') {
    var fv = swfobject.getFlashPlayerVersion();
    if (fv.major > 0) {
      flashVersion = fv.major + '.' + fv.minor + ' r' + fv.release;
    }
    else  {
      flashVersion = unknown;
    }
  }

  var language;
  if (navigator.userLanguage == "string") {
    language = navigator.userLanguage;
  } else if (navigator.language == "string") {
    language = navigator.language;
  }

  return {
    screen: screenSize,
    browser: browser,
    browserVersion: version,
    browserMajorVersion: majorVersion,
    mobile: mobile,
    os: os,
    osVersion: osVersion,
    cookies: cookieEnabled,
    flashVersion: flashVersion,
    language: language
  };
}

pixel.browserInfo = pixel.getClientDetails();

 // TODO

 /*************************
 **** CORE: ATTACHMENTS ***
 *************************/

 // TODO

 /*****************************
 *** CORE: AJAX | SOCKET.IO ****
 *****************************/

pixel.ajax = aja;

pixel.initCust = function() {
  var settings = window.pixelSettings;
  var postCust = pixel.constants.url.base + pixel.constants.url.customer
  var pixelUser = pixel.cookie.get(pixel.constants.cookie.id);

  pixel
    .ajax()
    .method('post')
    .type('json')
    .url(postCust)
    .body({
      settings: settings,
      cookie: pixelUser,
      browserInfo: pixel.browserInfo
    })
    .on('success', pixel.identify)
    .on('error', function(err, res) {
      pixel.logger(pixel.constants.messages.getCustFailed + ' '  + err, true);
    })
    .go();
}

pixel.init = function() {
  pixel.initTemplate();
  pixel.initCust();
}


pixel.identify = function(res) {
  var conv = res.conversations;
  // Once the the User is identified get its conversations
  console.log(res);
}

 /******************************
 *** HTML AND CSS GENERATION ***
 *******************************/
 // TODO: Shift this to a different html and css
 
pixel.generator = {
  html: [
    '<div id="{0}-container" class="{0}-container">',
      '<div class="{0}-message-button">',
        '<div class="{0}-initials"></div>',
      '</div>',
      '<div class="{0}-badge"></div>',
      '<div class="{0}-message-container">',
        '<div class="{0}-single-message">',
        '</div>',
      '</div>',
    '</div>'
  ].join('').replace(/\{0\}/g, pixel.constants.namespace),
  css: [
    // TODO
  ].join('').replace(/\{0\}/g, pixel.constants.namespace)
}

 /**********************
 ***** CONVERSATION MODULE ****
 **********************/

pixel.initTemplate = function() {
  var head = document.head || document.getElementByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (style.styleSheet) {
    style.styleSheet.cssText = pixel.generator.css;
  } else {
    style.appendChild(document.createTextNode(pixel.generator.css));
  }

  // Insert the styles
  // head.appendChild(style);

  // Insert the Template
  // pixel.insertAfterBody(pixel.generator.html);
}

pixel.conversation = {
  reply: function() {
    // POST /api/messages
  },
  fetch: function() {
    // GET /api/messages
  }
}


 /**********************
 *** PIXEL SETTINGS ****
 **********************/
 /* EXAMPLE PIXELSETTINGS
    window.pixelSettings = {
      client_id: 'abcdef', // required
      cust_id: 269,
      name: 'Jay Kanakiya', // not required
      email: 'jay@jaykanakiya.com'
    };
  */

if (!window.pixelSettings) {
  pixel.logger(pixel.constants.messages.noSettings, true);
} else {
  if (!window.pixelSettings.client_id) {
    pixel.logger(pixel.constants.messages.noClientId, true);
  } else if (window.pixelSettings.client_id.length !== 6) {
    pixel.logger(pixel.constants.messages.noClientId, true);
  } else if (!window.pixelSettings.cust_id) {
    // To be tracked using only cookies
    pixel.logger(pixel.constants.messages.noClientId, false);
  } else {
    pixel.init();
  }
}