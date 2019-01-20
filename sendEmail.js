const AWS = require ('aws-sdk');

module.exports.handler = async event => {
  const email = event.email;
  const message = event.message;
  try {
    const result = await sendEmail (email, message);
    if (result) {
      const response = {
        statusCode: 200,
        body: JSON.stringify (message),
      };
      return response;
    }
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify (e),
    };
  }
};

function sendEmail (email, message) {
  const ses = new AWS.SES ({region: 'us-east-1'});
  const promise_to_email = new Promise ((resolve, reject) => {
    if (!message || !email) {
      reject ('Incomplete Information');
    } else {
      const params = createInquieryParamsConfig (email, message);
      ses.sendEmail (params, (err, data) => {
        if (err) {
          reject (err);
        } else {
          resolve ('sent!');
        }
      });
    }
  });
  return promise_to_email;
}

function createInquieryParamsConfig (email, message) {
  const charset = 'UTF-8';
  const params = {
    Source: 'ringoyip0901@gmail.com',
    ReplyToAddresses: [email],
    Destination: {
      ToAddresses: ['ringoyip0901@gmail.com'],
    },
    Message: {
      Subject: {
        Data: 'From Portfolio',
        Charset: charset,
      },
      Body: {
        Text: {
          Charset: charset,
          Data: message,
        },
      },
    },
  };
  return params;
}
