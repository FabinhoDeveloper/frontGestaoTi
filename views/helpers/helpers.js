// helpers.js
const Handlebars = require('handlebars');

function formatarData(dataIso) {
  const data = new Date(dataIso);

  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0'); // Meses começam do zero
  const ano = data.getFullYear();

  return `${dia}/${mes}/${ano}`;
}

// Definindo o helper switch/case
// helpers.js
Handlebars.registerHelper('eq', function (a, b) {
  return a === b;
});

Handlebars.registerHelper('formatarData', function(dataIso) {
  return formatarData(dataIso);
});

