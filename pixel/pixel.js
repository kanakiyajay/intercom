'use strict';


 /* EXAMPLE PIXELSETTINGS
  window.pixelSettings = {
    client_id: 'abcdef', // required
    cust_id: 269,
    name: 'Jay Kanakiya', // not required
    email: 'jay@jaykanakiya.com'
  };
*/

/**
 * Pixel.js, js file to be inserted for every client
 *   Dependent upon:
 *     zepto.js | Main Lib | http://zeptojs.com/
 *     cookie-monster.js | Cookie Manipulation | https://github.com/jgallen23/cookie-monster
 *     tmpl.js | Templating | https://github.com/blueimp/JavaScript-Templates
 *     
 * Following has been distributed in below Modules
 * 
 *   - Inbuilt Core Wrappers
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
    id: '__PIXEL_USER',
    days: 365
  },
  url: {
    base: 'http://localhost:9000/api/',
    customer: 'customers',
    message: 'messages',
    template: {
      css: '/pixel/templates/css/pixel.css',
      html: '/pixel/templates/html/template.all.html'
    }
  },
  namespace: 'pixel',
  ids: {
    main: 'pixel-main',
    launcher: 'pixel-launcher',
    preMessage: 'pixel-pre-message',
    container: {
      main: 'pixel-container',
      conversation: 'pixel-conversion-container',
      window: 'pixel-conversation-all',
      single: 'pixel-single-conversation'
    },
    list: {
      all: 'pixel-conversation-list',
      single: 'pixel-conversations-body',
      wrapper: 'pixel-list-wrapper'
    },
    buttons: {
      close: 'pixel-close',
      menu: 'pixel-menu',
      minimize: 'pixel-minimize',
      add: 'pixel-add-conversation'
    },
    form: 'pixel-form',
    input: 'pixel-input'
  },
  messages: {
    noSettings: 'Please read the docs and install pixel tracker again',
    noClientId: 'Please make sure that you have enable client id and you have the correct clientId',
    noUserId: 'No user id has been installed',
    getCustFailed: 'Get Customer Called failed',
    NoConversations: 'No Conversations Present'
  }
}

pixel.customer = {};

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

// TODO: USE 1x1 gif for tracking things
// Will load the corresponding 1x1 gif with utm parameters
pixel.tracker = function(clientId, params) {
  
}

pixel.getElem = function(id) {
  return $('#' + id);
}

pixel.getElemByClass = function(cls) {
  return $('.' + cls);
}

pixel.getTemplStr = function(id) {
  return id + '-tmpl';
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

// TODO: Move Everything over here
pixel.cookie = monster;
pixel.persistent = {};

// Simple Getters and Setters for pixel
// TODO: Persist in Cookies
pixel.set = function(name, value) {
  pixel.persistent[name] = value;
  return value;
}

pixel.get = function(name) {
  return pixel.persistent[name]
}

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

pixel.initCust = function() {
  var settings = window.pixelSettings;
  var postCust = pixel.constants.url.base + pixel.constants.url.customer;
  var pixelUser = pixel.cookie.get(pixel.constants.cookie.id);

  $.ajax({
    url: postCust,
    type: 'POST',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify({
      settings: settings,
      cookie: pixelUser,
      browserInfo: pixel.browserInfo
    }),
    success: pixel.identify,
    error: function(err, res) {
      pixel.logger(pixel.constants.messages.getCustFailed + ' '  + err, true);
    }
  });
}

pixel.init = function() {
  pixel.initTemplate(function() {
    pixel.initCust();
    pixel.initElements();
    pixel.assignEvents.init();
  });
}

pixel.identify = function(res) {
  pixel.set('customer', res);
  // Drop a Cookie over here
  pixel.cookie.set(pixel.constants.cookie.id, res.cookie_id, pixel.constants.cookie.days);

  var convs = res.conversations;
  // Once the the User is identified get its conversations
  if (!convs.length) {
    pixel.logger(pixel.constants.messages.NoConversations, true);
    pixel.set('noConversations', true);
    return;
  }

  pixel.set('noConversations', false);

  // After Identification get the message and store them
  convs.forEach(function(conv) {
    if (conv.messages.length) {
      conv.last_message = conv.messages[conv.messages.length - 1].message;
      for (var i = 0; i < conv.messages.length; i++) {
        if (conv.messages[i].type === 'e2c') {
          conv.profile_pic = conv.messages[i].profile_pic;
          break;
        }
      }
    }
  });

  pixel.render.conversations(convs);
}

pixel.getMessages = function(convId) {
  if (!convId) return;
  var getMesg = pixel.constants.url.base + pixel.constants.url.message
                 + '/' + pixel.constants.url.customer;
  $.ajax({
    url: getMesg,
    type: 'GET',
    data: {
      conversation_id: convId,
      limit: 20
    },
    success: function(res) {
      pixel.render.messages(res);
    },
    error: function(er) {
      console.error(err);
    }
  });
}

pixel.postMesssage = function(mesg, cb) {
  var postMesg = pixel.constants.url.base + pixel.constants.url.message
                 + '/' + pixel.constants.url.customer;

  var convId = pixel.get('convId');

  $.ajax({
    url: postMesg,
    type: 'POST',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify({
      conversation_id: convId,
      message: mesg
    }),
    success: cb,
    error: function(err, res) {
      pixel.logger(pixel.constants.messages.getCustFailed + ' '  + err, true);
    }
  });
}

pixel.addConversation = function() {
  // Automatically Enable a new message interface
  pixel.elems.conv.hide();
  pixel.elems.container.show();
  pixel.elems.mesgC.show();
  pixel.elems.preMessage.show();
  pixel.elems.input.focus();
}

pixel.templater = tmpl;

 /**********************
 ***** CONVERSATION MODULE ****
 **********************/

pixel.initTemplate = function(cb) {
  //CSS
  $('<link>')
    .attr('rel', 'stylesheet')
    .attr('type', 'text/css')
    .attr('href', pixel.constants.url.template.css)
    .appendTo('head');

  // HTML
  $.get(pixel.constants.url.template.html, function(tmpl) {
    $('body').append(tmpl);
    var mainId = pixel.constants.ids.main;
    var html = pixel.templater(pixel.getTemplStr(mainId), {});
    $('body').append(html);
    cb();
  }); 
}

pixel.render = {
  conversations: function(convs) {
    var elemId = pixel.constants.ids.list.all;
    var $elem = pixel.getElem(elemId);
    var html = pixel.templater(pixel.getTemplStr(elemId), convs);
    $elem.html(html);
  },
  messages: function(messages) {
    var elemId = pixel.constants.ids.list.single;
    var $elem = pixel.getElem(elemId);
    var html = pixel.templater(pixel.getTemplStr(elemId), messages);
    if (messages.length) {
      pixel.elems.preMessage.hide();
    }
    $elem.html(html);
  }
}

 /**********************
 *** PIXEL SETTINGS ****
 **********************/ 

pixel.initElements = function() {
  pixel.elems = {
    container: pixel.getElem(pixel.constants.ids.container.conversation),
    launcher: pixel.getElem(pixel.constants.ids.launcher),
    conv: pixel.getElem(pixel.constants.ids.container.window),
    mesgC: pixel.getElem(pixel.constants.ids.container.single),
    close: pixel.getElemByClass(pixel.constants.ids.buttons.close),
    wrapper: pixel.getElemByClass(pixel.constants.ids.list.wrapper),
    menu: pixel.getElemByClass(pixel.constants.ids.buttons.menu),
    form: pixel.getElem(pixel.constants.ids.form),
    input: pixel.getElem(pixel.constants.ids.input),
    preMessage: pixel.getElem(pixel.constants.ids.preMessage),
    add: pixel.getElem(pixel.constants.ids.buttons.add)
  }
}

pixel.assignEvents = {
  init: function() {
    /* PIXEL LAUNCHER */
    this.launcher();
    
    /* PIXEL CONVERSATIONS */
    this.conversations();

    /* CLOSE BUTTON */
    this.close();

    /* MENU BUTTON */
    this.menu();

    /* SUBMIT BUTTON */
    this.submit();

    /* New Conversation */
    this.addConversation();
  },
  launcher: function() {
    pixel.elems.launcher.on('click', function() {
      pixel.elems.container.show();
      pixel.elems.mesgC.hide();
      pixel.elems.conv.show();
      pixel.elems.launcher.hide();
      var noConversations = pixel.get('noConversations');
      if (noConversations) {
        pixel.addConversation();
      }
    });
  },
  conversations: function() {
    pixel.elems.conv.on('click', 'li', function(e) {
      pixel.elems.container.show();
      pixel.elems.mesgC.show();
      pixel.elems.conv.hide();
      var convId = $(this).attr('data-id');
      pixel.getMessages(convId);
      pixel.set('convId', convId);
    });
  },
  close: function() {
    pixel.elems.close.on('click', function() {
      pixel.elems.container.hide();
      pixel.elems.wrapper.hide();
      pixel.elems.launcher.show();
    });
  },
  menu: function() {
    pixel.elems.menu.on('click', function() {      
      pixel.elems.mesgC.hide();
      pixel.elems.conv.show();
    });
  },
  minimize: function() {
    
  },
  submit: function() {
    pixel.elems.form.submit(function(e) {
      e.preventDefault();
      var mesg = pixel.elems.input.val();
      pixel.postMesssage(mesg, function(mesg) {
        // Clear the input
        pixel.elems.input.val('');

        // Render the conversation thread again
        pixel.getMessages(mesg.conversation_id);
        pixel.set('convId', mesg.conversation_id);
      });
    });
  },
  addConversation: function() {
    pixel.elems.add.on('click', pixel.addConversation);
  }
}

 /**********************
 *** PIXEL SETTINGS ****
 **********************/

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

    // TODO
    pixel.init();
  } else {
    pixel.init();
  }
}