// 
var express =require("express");
var db = require("../models");


module.exports = function(chatrouter){

// 
chatrouter.post('/usermessages/create', function (req, res) {
console.log("help");

var id;

  id = req.session.get('user.id');
  console.log(id);
  console.log(req.body.message1);
  db.userMessages.create({
    Message: req.body.message1,
    userId: id
  }).then(function(data){
    console.log("Message saved");  
  });
});

// When called , the calling page load/reloads and 
// returns username and chatroom name saved from the session
chatrouter.get('/index', function (req, res) {
  userName = req.session.get('user.name', 'goAWAY ');
  ChatroomName = req.session.get('chatroom.name', 'goAWAY ');
      console.log("going to  rooms  with User = "+ userName + " Chatrom name ="+ ChatroomName);
  var userinChatroom = {
    loginUser: userName,
    croom: ChatroomName
  };

  res.render('index', userinChatroom);
});
 // get the list of all the chatrooms from database
chatrouter.get('/chatroom', function (req, res) {  

   console.log("CHAT CONTROLLER: " + req.session.get('user.name', 'goAWAY '))  
  db.chatroom.findAll({
  }).then(function(allChatrooms){
      var ChatroomsObj = {
        chatroom_data : allChatrooms,
        userName: req.session.get('user.name', 'goAWAY ')
      };
    
    console.log("get rooms  worked");
     return res.render('home', ChatroomsObj);

  });
});

 // chatroom from different path

chatrouter.get('/chatroom/view', function (req, res) {
  db.chatroom.findAll({
  }).then(function(allChatrooms){
      var rChatrooms = {
        chatroom_data : allChatrooms
      };
    
    console.log("get rooms  worked");
     return res.render('chatroom', chatroom_data);

  });
});

// create the new chatroom into the database, does not check if the room is duplicate
chatrouter.post('/chatroom/create', function (req, res) {
  db.chatroom.create({
    chatroom_name: req.body.chatroom_name

  }).then(function(data){
    console.log("chatroom  creation worked!");
    res.redirect('/chatroom');
  });
});

 //  when user joins a chatroom its recorded in a table "users in chatroom"
 //  table is not furture used currently,can be used attendance in chatroom or users
chatrouter.put('/chatroom/join', function (req, res) {
 
  var lUserId = req.session.get('user.id', 'goAWAY ');
  var lChatroomId = req.body.chatroomID
      req.session.put('chatroom.name', req.body.chatroom_name);
    req.session.put('chatroom.id', req.body.chatroomID);
    console.log("JOIN CHAT ==" + req.body.chatroom_name)
  db.userInChatroom.create({
    active : true,
    userId: lUserId,
    chatroomId: lChatroomId
  }).then(function(data){
    console.log("chat room join  chatroom join worked!");
    res.redirect('/index');
  });
});
}; 
