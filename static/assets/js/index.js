'use strict';
$(document).ready( function() {  
  oApp.getIpAddress();
});

let oApp = new app();
let oServices = new Services();

oApp.firebase.init({
  apiKey: "AIzaSyA4j9ZAfoXdozRG51c_p3EMJYZvN-vkfDw",
  authDomain: "pave-digital.firebaseapp.com",
  projectId: "pave-digital"
});

$("#Form").submit( event => {
  event.preventDefault();

  let aData = new Array();

  $("#Form input").each( function (index) { aData.push( $(this).val() ) });

  let oData = {
    name: aData[0],
    email: aData[1]
  }

  oApp.firebase.post('leads', oData);

});
