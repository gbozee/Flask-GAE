// Generated by CoffeeScript 1.6.3
(function() {
  var ViewEventChat, ViewEvents, ViewEventsPost;

  ViewEventsPost = (function() {
    /*
    event of views /posts
    */

    function ViewEventsPost() {
      this.delete_post();
    }

    ViewEventsPost.prototype.delete_post = function() {
      /*
      delete the post
      :param url: $(@).attr('href')
      */

      return $(document).on('click', 'a.delete_post', function() {
        $.ajax({
          type: 'delete',
          url: $(this).attr('href'),
          dataType: 'json',
          cache: false,
          beforeSend: function() {
            return core.loading_on();
          },
          error: function() {
            core.loading_off();
            return core.error_message();
          },
          success: function(r) {
            core.loading_off();
            if (r.success) {
              return core.ajax({
                href: location.href
              }, false);
            } else {
              return $.av.pop({
                title: 'Error',
                message: 'You could not delete this post.',
                template: 'error'
              });
            }
          }
        });
        return false;
      });
    };

    return ViewEventsPost;

  })();

  ViewEventChat = (function() {
    /*
    event of views /chat
    */

    function ViewEventChat() {
      this.send_msg();
      this.chat_board_readonly();
    }

    ViewEventChat.prototype.send_msg = function() {
      return $(document).on('submit', 'form#form_chat_input', function() {
        var chat_token;
        chat_token = window.sessionStorage['chat_token'];
        $.ajax({
          type: 'post',
          url: $(this).attr('action'),
          dataType: 'json',
          cache: false,
          data: {
            token: chat_token,
            msg: $('#chat_msg').val(),
            name: $('#chat_name').val()
          },
          success: function(r) {
            if (r.success) {
              return $('#chat_msg').val('');
            }
          }
        });
        return false;
      });
    };

    ViewEventChat.prototype.chat_board_readonly = function() {
      return $(document).on('keypress', '#chat_board', function() {
        return false;
      });
    };

    return ViewEventChat;

  })();

  ViewEvents = (function() {
    function ViewEvents() {
      new ViewEventsPost();
      new ViewEventChat();
    }

    return ViewEvents;

  })();

  $(function() {
    core.setup();
    new ViewEvents();
    return core.after_page_loaded();
  });

}).call(this);
