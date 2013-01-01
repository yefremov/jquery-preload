/*
 * jQuery Preload - v0.1.0
 * Tiny image preloader using deferred's promise object.
 * https://github.com/yefremov/jquery-preload
 *
 * Copyright (c) 2012 Anton Yefremov
 * Free to use and abuse under the MIT license.
 * http://opensource.org/licenses/MIT
 */

(function ( factory ) {
  'use strict';

  if ( typeof define === 'function' && define.amd ) {
    // AMD. Register as an anonymous module
    define( ['jquery'], factory );
  } else {
    // Browser globals
    factory( jQuery );
  }
} (function ( $ ) {
  'use strict';

  // Static method
  $.preload = function ( sources ) {
    var queue = $.Deferred()
      , data = $.map( sources, function ( source ) {
        var part = $.Deferred()
          , image = $( '<img />' );

        // Call progress callback on queue
        part.done( queue.notify );

        // Resolve on error / load / onreadystatechange (IE)
        image.on( 'error load onreadystatechange', part.resolve ).attr( 'src', source );

        // Return a part promise object
        return part.promise();
      });

    // Resolve when all parts are done
    $.when.apply( this, data ).done( queue.resolve );

    // Return a queue promise object (then, done, fail, always, pipe, progress, and state)
    return queue.promise();
  };

  // Collection method
  $.fn.preload = function () {
    var collection = this
      // Find all image elements
      , elements = collection.find( '[src]' ).add( collection.filter('[src]') )
      // Map image elements to sources
      , sources = elements.map(function () {
        return this.getAttribute( 'src' );
      });

    // Preload and return a queue promise object (then, done, fail, always, pipe, progress, and state)
    return $.preload( sources );
  };
}));
