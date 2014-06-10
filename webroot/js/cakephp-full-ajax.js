/*\
|*|
|*|  IE-specific polyfill which enables the passage of arbitrary arguments to the
|*|  callback functions of javascript timers (HTML5 standard syntax).
|*|
|*|  https://developer.mozilla.org/en-US/docs/DOM/window.setInterval
|*|
|*|  Syntax:
|*|  var timeoutID = window.setTimeout(func, delay, [param1, param2, ...]);
|*|  var timeoutID = window.setTimeout(code, delay);
|*|  var intervalID = window.setInterval(func, delay[, param1, param2, ...]);
|*|  var intervalID = window.setInterval(code, delay);
|*|
\*/

if (document.all && !window.setTimeout.isPolyfill) {
  var __nativeST__ = window.setTimeout;
  window.setTimeout = function (vCallback, nDelay /*, argumentToPass1, argumentToPass2, etc. */) {
    var aArgs = Array.prototype.slice.call(arguments, 2);
    return __nativeST__(vCallback instanceof Function ? function () {
      vCallback.apply(null, aArgs);
    } : vCallback, nDelay);
  };
  window.setTimeout.isPolyfill = true;
}

if (document.all && !window.setInterval.isPolyfill) {
  var __nativeSI__ = window.setInterval;
  window.setInterval = function (vCallback, nDelay /*, argumentToPass1, argumentToPass2, etc. */) {
    var aArgs = Array.prototype.slice.call(arguments, 2);
    return __nativeSI__(vCallback instanceof Function ? function () {
      vCallback.apply(null, aArgs);
    } : vCallback, nDelay);
  };
  window.setInterval.isPolyfill = true;
}


/**
 * 
 */

(function ($) {
    'use strict';

    var Ajax = function () {};

    Ajax.prototype._ajax = function ($el, url, method, data) {
		var $container = $el.closest('[cake-container]');
		var $data = $el.data();
		
		if(jQuery.isEmptyObject($data)) {
					$el.attr('data-inner', '#'+$container.attr('id'));
		}
    
        var newData = $el.triggerHandler('cake-ajax:modify-data', data);
        if (newData) {
            data = newData;
        }
        $.ajax({
            url: url,
            type: method,
            dataType: 'json',
            data: data,
            headers: {'X-Cake-Ajax': true ,'X-Cake-Contain' : $container.attr('cake-container')},
            statusCode: {
                200: function (responseData) {
                    if (!responseData) {
                        responseData = {};
                    }
                    $el.trigger('cake-ajax:success', [$el, responseData]);
                },
                500: function () {
                    $el.trigger('cake-ajax:error', [$el, 500]);
                },
                400: function () {
                    $el.trigger('cake-ajax:error', [$el, 400]);
                },
                404: function () {
                    $el.trigger('cake-ajax:error', [$el, 404]);
                }
            },
            complete: function (jqXHR, textStatus) {
                $(document).trigger('cake-ajax:complete', [$el, jqXHR, textStatus]);
            }
        });
    };

    Ajax.prototype.click = function (e) {
        var $this = $(this),
            url = $this.attr('href'),
            method = $this.data('method'),
            data_str = $this.data('data'),
            data = null,
            keyval = null;

        if (!method) {
            method = 'get';
        }

        if (data_str) {
            data = {};
            data_str.split(',').map(
                function(pair) {
                    keyval = pair.split(':');
                    if (keyval[1].indexOf('#') === 0) {
                        data[keyval[0]] = $(keyval[1]).val();
                    } else {
                        data[keyval[0]] = keyval[1];
                    }
                }
            );
        }

        e.preventDefault();

        Ajax.prototype._ajax($this, url, method, data);
    };

    Ajax.prototype.submit = function (e) {
        var $this = $(this),
            url = $this.attr('action'),
            method = $this.attr('method'),
            data = $this.serialize();

        e.preventDefault();

        Ajax.prototype._ajax($this, url, method, data);
    };

    Ajax.prototype.cancel = function (e) {
        var $this = $(this),
            selector = $this.attr('data-cancel-closest');
        e.preventDefault();
        $this.closest(selector).remove();
    };

    Ajax.prototype.timeout = function (i, el) {
        var $el = $(el),
            timeout = $el.data('timeout'),
            url = $el.data('url'),
            method = $el.data('method');

        if (!method) {
            method = 'get';
        }

        window.setTimeout(Ajax.prototype._ajax, timeout, $el, url, method, null);
    };

    Ajax.prototype.interval = function (i, el) {
        var $el = $(el),
            interval = $el.data('interval'),
            url = $el.data('url'),
            method = $el.data('method');

        if (!method) {
            method = 'get';
        }

        window.setInterval(Ajax.prototype._ajax, interval, $el, url, method, null);
    };

    $(function () {
        $('body').on('click', '.ajax', Ajax.prototype.click);
        $('body').on('submit', '.ajax', Ajax.prototype.submit);
        $('body').on('click', 'a[data-cancel-closest]', Ajax.prototype.cancel);

        $('[data-timeout]').each(Ajax.prototype.timeout);
        $('[data-interval]').each(Ajax.prototype.interval);
    });
}(window.jQuery));
