"use strict";

define([
  'backbone'
], function(
        Backbone
        ) {

  var Router = Backbone.Router.extend({
    routes: {
      //"media-gallery/:id": "mediaGalleryIdRedirect",
      "media-gallery/:id/:pos": "mediaGallery",
      //"_bb_": "clearState",
      "*other": "defaultRoute"
    },
    initialize: function() {
      /*
       * Wiews without link
       */
      backboneApp.poll = {};
      $('.w__poll--left').each(function(i, o) {
        require(['views/poll'], function(poll) {
          var pollId = $(o).data('poll-id');
          var poll = new poll({
            pollId: pollId,
            $elem: $(o),
            thumbor: {
              resizeWidth: '342',
              resizeHeight: '230'
            }
          });
          backboneApp.poll["asside-" + i] = {};
          backboneApp.poll["asside-" + i].view = poll;
        });
      });
      $('.w__poll--right').each(function(i, o) {
        require(['views/poll'], function(poll) {
          var pollId = $(o).data('poll-id');
          var poll = new poll({
            pollId: pollId,
            $elem: $(o),
            thumbor: {
              resizeWidth: '468',
              resizeHeight: '340'
            }
          });
          backboneApp.poll["all-" + i] = {};
          backboneApp.poll["all-" + i].view = poll;
        });
      });
    },
    clearState: function() {
      // not supported ie8, ie9, android 4.1
      // Older iOS versions and Android 4.0.4 claim support, but implementation is too buggy to be useful.
      if (window.history && window.history.pushState) {
        history.pushState('', document.title, window.location.pathname);
      }
    },
    mediaGallery: function(id, currentItem) {
      currentItem = currentItem || 1;
      require(['views/media-gallery'], function(mediaGalleryView) {
        if (backboneApp.mediaGallery) {
          backboneApp.mediaGallery.afterMoveUnhashedOnce = true;
          backboneApp.mediaGallery.owlSliderGoTo(currentItem);
          return;
        }
        var $elem = $('.media-gallery-' + id);
        backboneApp.mediaGallery = new mediaGalleryView({$elem: $elem, currentItem: currentItem, id: id});
        if (backboneApp.set.device === 'desktop') {
          backboneApp.mediaGallery.parse();
          backboneApp.mediaGallery.render();
        } else if (backboneApp.set.device === 'tablet') {
          //dirty fix for viewport 1/2
          backboneApp.mediaGallery.refreshOnBack = true;
          //          
          backboneApp.mediaGallery.parseTab();
          backboneApp.mediaGallery.renderTab();
        } else {
          backboneApp.mediaGallery.parseMob();
          backboneApp.mediaGallery.renderMob();
        }
      });
    },
    defaultRoute: function() {
      if (backboneApp.mediaGallery) {
        //dirty fix for viewport 2/2
        if(backboneApp.mediaGallery.refreshOnBack){
          location = window.location.protocol + '//' + window.location.host + location.pathname;
          return;
        }
        //
        backboneApp.mediaGallery.undelegateEvents();
        backboneApp.mediaGallery.close();
        delete backboneApp.mediaGallery;
      }
    } 
  });

  return {
    initialize: function() {
      var router = new Router();
      Backbone.history.start();
      //Backbone.history.start({ pushState: true });
      return {router: router};
    }
  };




});