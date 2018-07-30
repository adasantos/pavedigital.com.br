'use stric';
function Services () {

  return  {

    dateTimeLocal: nMilliseconds => {

      let sDate;

      if (nMilliseconds) {

        let oDate = new Date(nMilliseconds);

        let date = oDate.toLocaleDateString();
            date = date.split('/')[2] + "-" + date.split('/')[1] + "-" + date.split('/')[0];

        let time = oDate.toLocaleTimeString();

        sDate = date + " " + time;

      }

      return sDate;
    },

    convertArrayObjToCSV: args => {

      let data = args.data ? args.data : null;

      if (!data || !data.length) return false;

      let delimiter = args.delimiter ? args.delimiter : ',';
      let qualifier = args.qualifier.value ? args.qualifier.value : '"';
      let lineDelimiter = args.lineDelimiter ? args.lineDelimiter : '\r\n';
      let ignoreQualifier = args.qualifier.ignoreColumns ? args.qualifier.ignoreColumns : [];
      let header = args.header ? args.header : '';

      let keys = ['email', 'name', 'ip', 'type', 'date'];
      let ctr;
      let result;

      if (header) {
        result = (header.join(delimiter)) + lineDelimiter;
      } else {
        result = (keys.join(delimiter)) + lineDelimiter;
      }

      data.forEach(function(item) {
        ctr = 0;

        keys.forEach(function(key) {

          if (ctr > 0) result += delimiter;

          if (ignoreQualifier.indexOf(key) === -1) {
            result += qualifier + item[key] + qualifier;
          } else {
            result += item[key];
          }

          ctr++;

        });

        result += lineDelimiter;

      });

      return result;

    },

    downloadCSV: args => {

      let csv = args.csv ? args.csv : null;

      if (csv == null) return;

      let filename = args.filename || 'download.csv';

      if (!csv.match(/^data:text\/csv/i)) {
        csv = 'data:text/csv;charset=UTF-8,' + '\uFEFF' + csv;
      }

      let data = encodeURI(csv);

      let link = document.createElement('a');
          link.setAttribute('href', data);
          link.setAttribute('download', filename);
          link.click();

    }
  }

}