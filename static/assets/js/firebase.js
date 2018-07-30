'use strict';
function app () {

  let self = new Object();
  let oServices = new Services();
  let oFirestore = null;
  let sIpAddress = '';

  function required(param) {
    throw new Error(`Parameter ${param} is required.`);
  }

  self.getIpAddress = () => {
    $.getJSON("https://jsonip.com", data => {
      sIpAddress = data.ip;
    });
  }

  self.download = collection => {

    let array = new Array();

    oFirestore.collection(collection).get()
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

    init: (oConfig = required('config')) => {

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

      self.firebase.get(collection);

    }

  }

  return self;

}

/*

$('.get').click( () => {
  oApp.firebase.get('users');
});

$('.save-csv').click( () => {
  oApp.download();
});

*/