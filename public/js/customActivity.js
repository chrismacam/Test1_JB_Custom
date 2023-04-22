define([
    'postmonger'
], function(
    Postmonger
) {
    'use strict';

    var connection = new Postmonger.Session();
    var payload = {};
    $(window).ready(onRender);

    connection.on('initActivity', initialize);
    connection.on('clickedNext', save);

    connection.on("requestedTokens", onGetTokens);
    function onGetTokens(tokens) {
      console.log(tokens);
    }
    function onRender() {
        connection.trigger('ready');
        connection.trigger("requestTokens");
    }
    const dataExtensionKey = "004EFBC4-5C8A-4EC8-82C0-0CE4F3C31E2C";

    $.ajax({
      type: "GET",
      url: `/data/v1/customobjectdata/key/${dataExtensionKey}/rowset`,
      headers: {
        "Authorization": `Bearer ${accessToken}`
      },
      success: function(data) {
        processData(data.items);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.error('Error fetching data:', textStatus, errorThrown);
      }
    });
    function processData(data) {
          const emailCount = {};
          let duplicateCount = 0;

          data.forEach((row) => {
            const email = row.EmailAddress.toLowerCase();
            if (emailCount[email]) {
              emailCount[email]++;
              if (emailCount[email] === 2) {
                duplicateCount++;
              }
            } else {
              emailCount[email] = 1;
            }
          });
      
          displayDuplicates(duplicateCount);
        }
        

    function initialize(data) {
        if (data) {
            payload = data;``
            var setcpURL = payload['arguments'].execute.inArguments[0].cloudpageURL;
            $('#cpURL').val(setcpURL);
        }
    }

    function save() {
        var cpURL = $('#cpURL').val();
        payload['arguments'].execute.inArguments = [{
            "subscriberKey": "{{Contact.Key}}",
            "cloudpageURL": cpURL
        }];
        payload['metaData'].isConfigured = true;
        console.log(payload);
        connection.trigger('updateActivity', payload);
    }
});