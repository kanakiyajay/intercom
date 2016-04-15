'use strict';

/**
 * Pixel.js, js file to be inserted for every client
 *   Dependent upon:
 *     ajax.js | Simple jQuery Ajax Wrapper
 *     transition.js | Simple Animation function
 *
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
  namespace: 'pixel',
  messages: {
    noSettings: 'Please read the docs and install pixel tracker again',
    noClientId: 'Please make sure that you have enable client id and you have the correct clientId',
    noUserId: 'No user id has been installed'
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

 // TODO

 /*************************
 **** CORE: ATTACHMENTS ***
 *************************/

 // TODO

 /*****************************
 *** CORE: AJAX | SOCKET.IO ****
 *****************************/

pixel.ajax = ajax;

pixel.init = function() {
  var settings = window.pixelSettings;
}

 /**********************
 *** HTML AND CSS GENERATION ****
 **********************/
pixel.generator = {
  html: [
    '<div id="{0}-container" class="{0}-container">',
      '<div class="{0}-message-button">',
        '<p>Icon</p>',
      '</div>',
      '<div class="{0}-message-container">',
        '<div class="{0}-single-message">',
        '</div>',
      '</div>',
    '</div>'
  ].join('').replace('{0}', pixel.constants.namespace),

  css: [

  ].join('')
}

 /**********************
 ***** CONVERSATION MODULE ****
 **********************/

pixel.conversation = {
  reply: function() {
    
  },
  fetch: function() {
    // Ajax Call to fetch messages
    pixel.ajax({
      url: pixel.constants.base + pixel.constants.
    })
  }
}


 /**********************
 *** PIXEL SETTINGS ****
 **********************/
 /* EXAMPLE PIXELSETTINGS
    window.pixelSettings = {
      client_id: 'abcdef', // required
      user_id: 269,
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
  } else if (!window.pixelSettings.user_id) {
    // To be tracked using only cookies
    pixel.logger(pixel.constants.messages.noClientId, false);
  } else {
    pixel.init();
  }
}