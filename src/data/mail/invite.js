const ical = require('ical-generator');

/* HOW TO USE 
  
  EXAMPLE
  const mailer = require('../../data/mail/mailer');
  const invite = require('../../data/mail/invite');
  const moment = require('moment');
  let details = {
    startTime: moment(),
    endTime: moment().add(1, 'hour'),
    summary: 'Você tem uma consulta agendada',
    description: 'Data: | Horário: | Profisional: ',
    location: 'Avenida Paulista, XYZ',
    url: 'be-upp.domain.com',
  }

  var newInvite = invite(details);

  var mailOptions = {
    to: 'paciente@domain.com',
    subject: 'Olá, paciente! Isto é um teste',
    html: '<h1>Welcome to be-upp</h1>'
  }

  let alternatives = {
    "Content-Type": "text/calendar",
    "method": "REQUEST",
    "content": newInvite.toString(),
    "component": "VEVENT",
    "Content-Class": "urn:content-classes:calendarmessage"
  }

  mailOptions['alternatives'] = alternatives;
  mailOptions['alternatives']['contentType'] = 'text/calendar';
  mailOptions['alternatives']['content'] = newInvite.toString();

  mailer.sendMail(mailOptions, function (error, response) {
    if (error) {
      console.log(error);
    } else {
      console.log('Mensagem enviada: ', response);
    }
  });
*/

var invite = (details) => {
  const calendar = ical({ name: 'Evento do bee-up' });
  calendar.createEvent({
    start: details.startTime,
    end: details.endTime,
    summary: details.summary,
    description: details.description,
    location: details.location,
    url: details.url,
  });
  return calendar;
};

module.exports = invite;
