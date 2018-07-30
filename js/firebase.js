'use strict';
function app () {

  let self = new Object();
  let oServices = new Services();
  let oFirestore = null;
  let sIpAddress = '';

  self.getIpAddress = () => {
    $.getJSON("https://jsonip.com", function(data) {
      sIpAddress = data.ip;
    });
  }

  self.download = () => {

    let array = new Array();

    oFirestore.collection('users').get()
    .then(docs => {

      docs.forEach(doc => {

        let data = doc.data();
        data.date = oServices.dateTimeLocal(data.date);
        array.push(data);

      });

      let csv = oServices.convertArrayObjToCSV({
        data: array,
        delimiter: ',',
        qualifier: {
          value: '"'
        }
      });

      oServices.downloadCSV({
        csv: csv,
        filename: 'users.csv'
      });

    }).catch(error => {
      console.log("Error getting document:", error);
      return false;
    });
  }

  self.firebase = {

    init: oConfig => {

      firebase.initializeApp(oConfig);
      oFirestore = firebase.firestore();
      oFirestore.settings({timestampsInSnapshots: true});

    },
    get: collection => {

      let oCollection = oFirestore.collection(collection);
      let aDocs = new Array();

      oCollection.get().then(function(docs) {

        docs.forEach(doc => { aDocs.push(JSON.stringify(doc.data())); });

      }).catch(function(error) {
        console.log("Error getting document:", error);
        return false;
      });

    },
    post: (collection, obj) => {

      let oCollection = oFirestore.collection(collection);

      obj.ip = sIpAddress;
      obj.date = new Date().getTime();

      oCollection.add(obj)
      .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch(function(error) {
        console.error("Error adding document: ", error);
      });

      document.querySelector('form').reset();

      self.firebase.get('users');

    }

  }

  return self;

}

let oApp = new app();

oApp.firebase.init({
  apiKey: "AIzaSyD0xXt796yQ3FqzrZ7l6TLPDAaNSyQunlY",
  authDomain: "tests-rnunes.firebaseapp.com",
  projectId: "tests-rnunes"
});

$('.get').click( () => {
  oApp.firebase.get('users');
});

$('.save-csv').click( () => {
  oApp.download();
});

$("#Form").iForm({
  Submit: function(Json){
    oApp.firebase.post('users', Json);
  },
  Error: function (Input,sMsg){        
    console.error(sMsg);
  }
});

$(document).ready( function() {  
  oApp.getIpAddress();
});