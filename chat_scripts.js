document.getElementById("send_Message_Button").addEventListener("click", function () {
    window.postMessage({
        type: "FROM_PAGE"
        , text: "Hello from the webpage!"
    }, "*");
    //get instant message
    var message = document.getElementById("message").value;
    if(message != ""){
        var ul = document.getElementById("conversation");
        var li = document.createElement("li");
        //current time
        var dt = new Date();
        var time = dt.getHours() + ":" + dt.getMinutes();
        //chat bubble
        var chatboxUserSay = "<div class=\"media-right\"> <img src=\"http://bootdey.com/img/Content/avatar/avatar2.png\" class=\"img-circle img-sm\" alt=\"Profile Picture\"> </div> <div class=\"media-body pad-hor speech-right\"> <div class=\"speech\"> <p>" + message + "</p> <p class=\"speech-time\"> <i class=\"fa fa-clock-o fa-fw\"></i> " + time + "</p> </div> </div> ";
        var e = document.createElement('div');
        e.innerHTML = chatboxUserSay;
        li.appendChild(e);
        li.setAttribute("class", "mar-btm");
        ul.appendChild(li);
        //reset the message
        document.getElementById("message").value = "";
        getBotReply(message);

        //scroll to end of the chat
        var obj = document.getElementById("scroll");
        obj.scrollTop = obj.scrollHeight;
    }
    
}, false);

//save conversation id
var id;

function getBotReply(message) {
    //current time
    var dt = new Date();
    var time = dt.getHours() + ":" + dt.getMinutes();
    var ul = document.getElementById("conversation");
    var li = document.createElement("li");
    var e = document.createElement('div');
    
    $.get("http://localhost/Program-O/chatbot/conversation_start.php", {
        say: message
        , convo_id: id
    }, function (responseData) {
        var result = $.parseJSON(responseData);
        var botsay = result['botsay'];
       if (id == null) {
                   //cookie JSON to create
           
                   var prevConverstations = [
                   { 'usersay' : message, 'botsay' : botsay ,'time' : time}
                   ];

                   id = result['convo_id'];
               }else{
                    //cookie add new convo , push to the JSON
                   var prevConverstations = $.parseJSON($.cookie("prevConverstations"));
                   prevConverstations.push(
                   { 'usersay' : message, 'botsay' : botsay ,'time' : time}
                   );
               }

       //save the cookie
        $.cookie("prevConverstations", JSON.stringify(prevConverstations));

        var chatboxBotSay = "<div class=\"media-left\"><img src=\"http://bootdey.com/img/Content/avatar/avatar1.png\" class=\"img-circle img-sm\" alt=\"Profile Picture\"></div><div class=\"media-body pad-hor\"><div class=\"speech\"><p>" + botsay + "</p><p class=\"speech-time\"><i class=\"fa fa-clock-o fa-fw\"></i> " + time + "</p></div></div>";
        e.innerHTML = chatboxBotSay;
        
        li.appendChild(e);
        li.setAttribute("class", "mar-btm");
        ul.appendChild(li);

        var obj = document.getElementById("scroll");
        obj.scrollTop = obj.scrollHeight;
        
    });
}

//enter button action listener
document.getElementById("message").addEventListener("keyup", function (event) {
    event.preventDefault();
    //enter button
    if (event.keyCode == 13) {
        document.getElementById("send_Message_Button").click();
    }
});


//load history button click event listener
document.getElementById("load_History_Button").addEventListener("click", function () {

    try{
        var prevConverstations = $.parseJSON($.cookie("prevConverstations"));
        $(jQuery.parseJSON(JSON.stringify(prevConverstations))).each(function() {
        //User bubble
        addChatBubble(this.usersay,this.time,true);
        //Bot Bubble
        addChatBubble(this.botsay,this.time,false);
        });
    }catch(err){
        alert("no fluffing history dude. move on!");
    }

    //disabling the button after a click
    $(this).prop('disabled',true);
 
}, false);

//delete history button click event listener
document.getElementById("clear_History_Button").addEventListener("click", function () {
    //alert("delete triggered");
    $.cookie("prevConverstations", { path: '/' });
    //$.cookie('prevConverstations', null);
    alert("delete finished");
 
}, false);

//create chat bubble when load history is clicked
function addChatBubble(message,time,isUser){
    var ul = document.getElementById("conversation");
    var li = document.createElement("li");
    var e = document.createElement('div');


    if(isUser===false){
        var chatboxBotSay = "<div class=\"media-left\"><img src=\"http://bootdey.com/img/Content/avatar/avatar1.png\" class=\"img-circle img-sm\" alt=\"Profile Picture\"></div><div class=\"media-body pad-hor\"><div class=\"speech\"><p>" + message + "</p><p class=\"speech-time\"><i class=\"fa fa-clock-o fa-fw\"></i> " + time + "</p></div></div>";
        e.innerHTML = chatboxBotSay;
    }else if(isUser ===true){
        var chatboxUserSay = "<div class=\"media-right\"> <img src=\"http://bootdey.com/img/Content/avatar/avatar2.png\" class=\"img-circle img-sm\" alt=\"Profile Picture\"> </div> <div class=\"media-body pad-hor speech-right\"> <div class=\"speech\"> <p>" + message + "</p> <p class=\"speech-time\"> <i class=\"fa fa-clock-o fa-fw\"></i> " + time + "</p> </div> </div> ";
        e.innerHTML = chatboxUserSay;
    }

        li.appendChild(e);
        li.setAttribute("class", "mar-btm");
        ul.appendChild(li);

        var obj = document.getElementById("scroll");
        obj.scrollTop = obj.scrollHeight;

}