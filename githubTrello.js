'use strict';
const request = require('request');
const compare = require('safe-compare');
const crypto = require('crypto');

module.exports = function(context, cb) {

  //Check signature using our stored secret
  let hmac, calculatedSignature;
  hmac = crypto.createHmac('sha1', context.secrets.GITHUB_SECRET);
  hmac.update(JSON.stringify(context.body, null, 0));
  calculatedSignature = 'sha1=' + hmac.digest('hex');
  let signature = context.headers['x-hub-signature'];

  if (!compare(signature, calculatedSignature)) {
    let error = new Error('Unauthorized request.');
    error.status = 401;
    cb(error);
  }

  // Is the request OK?
  if (context.body) {
    const headers = {
      'User-Agent': 'Super Agent/0.0.1',
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    let url = '';

    // Malformed payload?
    if(context.body.issue && context.body.issue.url)
      url = context.body.issue.url;
    else{
      let error = new Error('Malformed payload.');
      error.status = 400;
      cb(error);
    }

    // We get more information from github's API
    const githubRequest = {
      url: url,
      method: 'GET',
      headers: headers,
      form: {}
    };

    // Requesting gihub API...
    request(githubRequest, function (error, response) {
      if (!error && response.statusCode === 200) {
        const title = JSON.parse(response.body).title;

        // Description will contain a clickable link to the github issue
        // Since we receive an API url, we need to make some changes
        let desc = url;
        desc = desc.replace('api.', '');
        desc = desc.replace('/repos', '');

        let key = context.secrets.TRELLO_KEY;
        let token = context.secrets.TRELLO_TOKEN;
        let idList = context.secrets.TRELLO_IDLIST;

        let baseUrl = 'api.trello.com';
        let apiVersion = 1;
        let resource = 'cards';

        // Request options
        const trelloRequest = {
          url: `https://${baseUrl}/${apiVersion}/${resource}?key=${key}&token=${token}&name=${title}&desc=${desc}&idList=${idList}`,
          method: 'POST',
          headers: headers,
          form: {}
        };
        console.log(trelloRequest.url);
        // Posting the card...
        request(trelloRequest, function (error, response, body) {
          if (!error && response.statusCode === 200) {
            // Print out the response body for debug..
            console.log(body);
          }
        });
        // Inform github webhook that eveything is under control
        cb(null, {});
      }
    });
  }else{
    let error = new Error('No payload in body, remember to call the webtask from a github webhook.');
    error.status = 400;
    cb(error);
  }

};



