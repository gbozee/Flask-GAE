// Generated by CoffeeScript 1.6.3
(function() {
  var core, user_agent;

  core = {

    /*
    core JavaScript object.
    */
    is_safari: false,
    is_ie: false,
    socket: null,
    setup: function() {

      /*
      setup core
      */
      this.setup_nav();
      this.setup_link();
      this.setup_enter_submit();
      return window.onpopstate = function(e) {
        return core.pop_state(e.state);
      };
    },
    pop_state: function(state) {

      /*
      pop state
      */
      if (state) {
        $('.modal.in').modal('hide');
        state.is_pop = true;
        this.miko(state, false);
      }
    },
    miko: function(state, push) {

      /*
      みこ
      :param state: history.state
      :param push: true -> push into history, false do not push into history
      */
      var before_index;
      before_index = $('#nav_bar li.active').index();
      if (state.method == null) {
        state.method = 'get';
      }
      if (state.method !== 'get') {
        push = false;
      }
      $.ajax({
        url: state.href,
        type: state.method,
        cache: false,
        data: state.data,
        async: !(core.is_safari && state.is_pop),
        beforeSend: function(xhr) {
          var index;
          index = state.href === '/' ? 0 : $('#nav_bar li a[href*="' + state.href + '"]').parent().index();
          core.nav_select(index);
          xhr.setRequestHeader('X-Miko', 'miko');
          return core.loading_on();
        },
        error: function() {
          core.loading_off();
          core.error_message();
          return core.nav_select(before_index);
        },
        success: function(r) {
          var content, miko, title;
          core.loading_off();
          if (push) {
            if (state.href !== location.pathname || location.href.indexOf('?') >= 0) {
              state.nav_select_index = $('#nav_bar li.active').index();
              history.pushState(state, document.title, state.href);
            }
            $('html, body').animate({
              scrollTop: 0
            }, 500, 'easeOutExpo');
          }
          miko = r.match(/<!miko>/);
          if (!miko) {
            location.reload();
            return;
          }
          title = r.match(/<title>(.*)<\/title>/);
          r = r.replace(title[0], '');
          document.title = title[1];
          content = r.match(/\s@([#.]?\w+)/);
          if (content) {
            $(content[1]).html(r.replace(content[0], ''));
          }
          return core.after_page_loaded();
        }
      });
      return false;
    },
    error_message: function() {

      /*
      pop error message.
      */
      return $.av.pop({
        title: 'Error',
        message: 'Loading failed, please try again later.',
        template: 'error'
      });
    },
    validation: function($form) {

      /*
      validation
      */
      var success;
      success = true;
      $form.find('input, textarea').each(function() {
        var validation;
        validation = $(this).attr('validation');
        if (validation && validation.length > 0) {
          if ($(this).val().match(validation)) {
            $(this).closest('.control-group').removeClass('error');
            return $(this).parent().find('.error_msg').remove();
          } else {
            $(this).closest('.control-group').addClass('error');
            $(this).parent().find('.error_msg').remove();
            if ($(this).attr('msg')) {
              $(this).parent().append($('<label for="' + $(this).attr('id') + '" class="error_msg help-inline">' + $(this).attr('msg') + '</label>'));
            }
            return success = false;
          }
        }
      });
      return success;
    },
    loading_on: function() {

      /*
      loading
      */
      return $('body, a, .table-pointer tbody tr').css({
        cursor: 'wait'
      });
    },
    loading_off: function() {
      $('body').css({
        cursor: 'default'
      });
      return $('a, .table-pointer tbody tr').css({
        cursor: 'pointer'
      });
    },
    nav_select: function(index) {

      /*
      nav bar
      */
      if (index >= 0 && !$($('#nav_bar li')[index]).hasClass('active')) {
        $('#nav_bar li').removeClass('active');
        return $($('#nav_bar li')[index]).addClass('active');
      }
    },
    setup_nav: function() {
      var index, match;
      match = location.href.match(/\w(\/\w*)/);
      if (match) {
        index = match[1] === '/' ? 0 : $('#nav_bar li a[href*="' + match[1] + '"]').parent().index();
        $('#nav_bar li').removeClass('active');
        return $($('#nav_bar li')[index]).addClass('active');
      }
    },
    setup_link: function() {

      /*
      setup hyper links and forms to ajax and push history.
      */
      if (this.is_ie) {
        return;
      }
      $(document).on('click', 'a:not([href*="#"])', function(e) {
        var href;
        if (e.metaKey) {
          return;
        }
        if ($(this).closest('.active').length > 0 && $(this).closest('.menu').length > 0) {
          return false;
        }
        href = $(this).attr('href');
        if (href && !$(this).attr('target')) {
          core.miko({
            href: href
          }, true);
          return false;
        }
      });
      $(document).on('submit', 'form[method=get]:not([action*="#"])', function() {
        var href;
        href = $(this).attr('action') + '?' + $(this).serialize();
        core.miko({
          href: href
        }, true);
        return false;
      });
      return $(document).on('submit', 'form[method=post]:not([action*="#"])', function() {
        var href;
        if (core.validation($(this))) {
          href = $(this).attr('action');
          core.miko({
            href: href,
            data: $(this).serialize(),
            method: 'post'
          });
          $('.modal.in').modal('hide');
        }
        return false;
      });
    },
    setup_enter_submit: function() {

      /*
      .enter-submit.keypress() Ctrl + Enter then submit the form
      */
      return $(document).on('keypress', '.enter-submit', function(e) {
        if (e.keyCode === 13 && e.ctrlKey) {
          $(this).closest('form').submit();
          return false;
        }
      });
    },
    after_page_loaded: function() {

      /*
      events of views
      */
      core.setup_datetime();
      core.setup_focus();
      core.setup_tooltip();
      return core.setup_chat();
    },
    setup_datetime: function() {

      /*
      datetime
      */
      return $('.datetime').each(function() {
        var date;
        try {
          date = new Date($(this).attr('datetime'));
          return $(this).html(date.toFormat($(this).attr('format')));
        } catch (_error) {}
      });
    },
    setup_focus: function() {

      /*
      focus
      */
      return $('.focus').select();
    },
    setup_tooltip: function() {

      /*
      tool tip
      */
      return $('[rel="tooltip"]').tooltip();
    },
    setup_chat: function() {

      /*
      setup_chat
      */
      var chat_token;
      if ($('#chat').length > 0) {
        chat_token = window.sessionStorage['chat_token'];
        return $.ajax({
          type: 'post',
          url: '/chat/setup',
          dataType: 'json',
          cache: false,
          data: {
            chat_token: chat_token
          },
          success: function(r) {
            var channel;
            window.sessionStorage['chat_token'] = r.chat_token;
            $('#chat_name').val(r.name);
            channel = new goog.appengine.Channel(r.channel_token);
            core.socket = channel.open();
            core.socket.onmessage = core.chat_on_message;
            return core.socket.onerror = core.chat_on_error;
          }
        });
      } else if (core.socket) {
        return core.socket.close();
      }
    },
    chat_on_message: function(msg) {
      msg = JSON.parse(msg.data);
      if (msg.rename) {
        $('#chat_board').append(msg.rename.old_name + ' rename to ' + msg.rename.new_name + '\n');
        $('#chat_name').val(msg.rename.new_name);
      }
      if (msg.message) {
        $('#chat_board').append(msg.name + ': ' + msg.message + '\n');
      }
      return $('#chat_board').animate({
        scrollTop: $('#chat_board').prop('scrollHeight')
      }, 500, 'easeOutExpo');
    },
    chat_on_error: function() {
      window.sessionStorage.removeItem('chat_token');
      return this.setup_chat();
    }
  };

  window.core = core;

  user_agent = navigator.userAgent.toLowerCase();

  core.is_safari = user_agent.indexOf('safari') !== -1 && user_agent.indexOf('chrome') === -1;

  core.is_ie = user_agent.indexOf('msie') !== -1;

}).call(this);