(function($){
  Drupal.behaviors.wsComment = {
    attach: function() {

      if(window.WebSocket){
//        $('#comments').remove();
      } else {
        $('.chat_wrapper').remove();
      }

  // TODO: Implement $base_path

      var wsUri = "ws://local.drupal-ws:9000/sites/all/modules/ws_comment/server.php";
      websocket = new WebSocket(wsUri);

      websocket.onopen = function(ev) { // connection is open
        $('#message_box').append("<div class=\"system_msg\">Connected!</div>"); //notify user
      }

      $('#send-btn').click(function(e){ //use clicks message send button
        e.preventDefault();
        var mymessage = $('#message').val(); //get message text
        var myname = $('#name').val(); //get user name

        if(myname == ""){ //empty name?
          alert("Enter your Name please!");
          return;
        }
        if(mymessage == ""){ //emtpy message?
          alert("Enter Some message Please!");
          return;
        }
        var nid = Drupal.settings.ws_comment.nid;
        var uid = Drupal.settings.ws_comment.uid;
        //prepare json data
        var msg = {
          nid: nid,
          uid: uid,
          message: mymessage,
          name: myname,
//          color : '#00FF00'
        };
        wsSaveComment(msg);
        //convert and send data to server
        websocket.send(JSON.stringify(msg));
      });

      //#### Message received from server?
      websocket.onmessage = function(ev) {
        var msg = JSON.parse(ev.data); //PHP sends Json data
        var type = msg.type; //message type
        var umsg = msg.message; //message text
        var uname = msg.name; //user name
        var ucolor = msg.color; //color

        if(type == 'usermsg')
        {
          $('#message_box').append("<div class=\"comment\"><span class=\"user_name\" style=\"color:#"+ucolor+"\">"+uname+"</span> : <span class=\"user_message\">"+umsg+"</span></div>");
        }
        if(type == 'system')
        {
          $('#message_box').append("<div class=\"system_msg\">"+umsg+"</div>");
        }

        $('#message').val(''); //reset text
      };

      websocket.onerror	= function(ev){$('#message_box').append("<div class=\"system_error\">Error Occurred - "+ev.data+"</div>");};
      websocket.onclose 	= function(ev){$('#message_box').append("<div class=\"system_msg\">Connection Closed</div>");};

      function wsSaveComment(msg) {
        var url = window.location.origin + "/ws_comment/save/" + JSON.stringify(msg);
        $.ajax({
          url: url,
          success: function(data){
//            alert(url);
//            if (data == 1) {
//
//            } else {
//              alert ('Something is wrong here...');
//            }
          }
        });
      }

    }
  }
})(jQuery);