const sgMail = require("@sendgrid/mail");

const sendEmail = async (dto) => {
  console.log('sendEmail', JSON.stringify(dto))
  try {
    const {to, subject, text, html} = dto
    sgMail.setApiKey('');
    const msg = {
      to, // Change to your recipient
      from: "devs@dkeys.io", // Change to your verified sender
      subject,
      text,
      html
    };
    const mailSendResult = await sgMail.send(msg)
    console.log(`mailSendResult - ${JSON.stringify(mailSendResult)}`)
      // .then(() => {
      //   console.log("Email sent");
      // })
      // .catch((error) => {
      //   console.error(error.response.body);
      // });
  } catch (error) {
    throw error;
  }
}


sendEmail({
  to: 'lcs86@atomrigs.io', subject: 'subject', text: 'test', html: '<div>hi</div>'
})