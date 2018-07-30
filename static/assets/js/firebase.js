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
      let eAlert = document.querySelector('#alert');
      let eBtn = document.querySelector('#btn-request');
          eBtn.setAttribute('disabled', 'disabled');
          eBtn.textContent = 'Solicitando ...';

      obj.ip = sIpAddress;
      obj.date = new Date().getTime();

      oCollection.add(obj)
      .then( docRef => {

        let text = '<strong>Sucesso!</strong> Recebemos seu pedido, em breve receberá o material.';
        oServices.alert.show('info', text, eAlert);

        document.querySelector('form').reset();
        eBtn.removeAttribute('disabled');
        eBtn.textContent = 'Solicitar material';

      })
      .catch( error =>  {

        let element = document.querySelector('#alert');
        let text = '<strong>Ahh!</strong> Ocorreu um problema no registro do pedido. Tente novamente.';

        oServices.alert.show('danger', text, eAlert);
        eBtn.removeAttribute('disabled');
        eBtn.textContent = 'Solicitar material';

        console.error('Error adding document:', error);

      });

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