'use strict';
$(document).ready( function() {  
  oApp.getIpAddress();
});

let oApp = new app();

oApp.firebase.init({
  apiKey: "AIzaSyA4j9ZAfoXdozRG51c_p3EMJYZvN-vkfDw",
  authDomain: "pave-digital.firebaseapp.com",
  projectId: "pave-digital"
});

$("#Form").iForm({
  Submit: function(Json){
    oApp.firebase.post('leads', Json);
  },
  Error: function (Input,sMsg){        
    console.error(sMsg);
  }
});
