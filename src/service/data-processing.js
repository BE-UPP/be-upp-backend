const DataProcessingModel = require('../data/models/data-processing');
const math = require('mathjs');

const error = {message: 'JSON inválido', code: 400};

var variables = {};

const addProcessData = async(data) => {
  try {
    const dado = await DataProcessingModel.create(data);
    return dado;
  } catch (error) {
    const err = {
      message: error.message,
      code: 400,
    };
    throw err;
  }
};

const getProcessData = async(version) => {
  try {
    const dado = await DataProcessingModel.findOne({version: version}).exec();
    return dado;
  } catch (error) {
    const err = {
      message: error.message,
      code: 400,
    };
    throw err;
  }
};

const processData = async(formData) => {
  try {

    let version = formData.templateVersion;
    let dataProcessing = await getProcessData(version);

    for (let key in formData) {
      let variables = formData[key].variables;
      let values = formData[key].values;

      if (values == null)
        continue;

      for (let i = 0; i < values.length; i += 1) {
        setVariable(variables[i], values[i]);
      }
    }

    compute(dataProcessing);

    return variables;

  } catch (error) {
    const err = {
      message: error.message,
      code: 400,
    };
    throw err;
  }
};

module.exports = {
  processData: processData,
  addProcessData: addProcessData,
  getProcessData: getProcessData,
};


function setVariable(variable, value) {
  variables[variable] = value;
}

function getVariable(variable) {
  return variables[variable];
}

function compute(data) {
  let operations = data.operations;

  for (let i = 0; i < operations.length; i++) {
    let operation = operations[i];
    switch (operation.type) {
      case 'Table':
        computeTable(operation);
        break;
      case 'Math':
        computeMath(operation);
        break;
      default:
        break;
    }
  }

}

function recursiveTable(input, table) {
  // console.log('Input:', input);
  // console.log('Table:', table);
  if (input.length === 0)
    throw error;

  let variable = input[0];
  let newTable;
  // console.log("Tipo: ", variable.type)
  switch (variable.type) {
    case 'text':
      newTable = table[getVariable(variable.label)];
      break;
    case 'number':
      let y = getVariable(variable.label);
      let passou = false;

      // console.log("Y: ", y);

      // console.log("Table: ", table);


      for (let key in table) {
        let op = key.substr(0, 2);
        let aux = key.substr(2, key.length);
        let aux2 = aux.split('_');
        let x1 = parseFloat(aux2[0]);
        let x2 = parseFloat(aux2[1]);
        let cmp = null;

        // console.log('OP: ', op);
        // console.log('x1: ', x1);
        // console.log('x2: ', x2);

        switch (op) {
          case '__':
            cmp = true;
            break;
          case '==':
            cmp = (y === x1);
            break;
          case '<=':
            cmp = (y <= x1);
            break;
          case '>=':
            cmp = (y >= x1);
            break;
          case '<<':
            cmp = (y < x1);
            break;
          case '>>':
            cmp = (y > x1);
            break;
          case '[]':
            cmp = (y >= x1 && y <= x2);
            break;
          case '[)':
            cmp = (y >= x1 && y < x2);
            break;
          case '(]':
            cmp = (y > x1 && y <= x2);
            break;
          case '()':
            cmp = (y > x1 && y < x2);
            break;
          default:
            throw error;
        }

        // console.log(cmp);
        if (cmp) {
          newTable = table[key];
          passou = true;
          break;
        }
      }

      if (!passou) {
        throw error;
      }
      break;
    default:
      throw error;
  }

  if (newTable === {})
    throw error;

  if (input.length === 1)
    return newTable;

  let newInput = input;
  newInput.shift();

  return recursiveTable(newInput, newTable);

}

function computeTable(operation) {
  // console.log(operation.input);
  let input = JSON.parse(JSON.stringify(operation.input));
  let output = recursiveTable(
    input, operation.body);
  setVariable(operation.output, output);
}

const parser = math.parser();

function computeMath(operation) {

  operation.input.forEach(
    (variable, i) => {
      parser.set(variable, getVariable(variable));
    },
  );

  let result = parser.evaluate(operation.body);
  setVariable(operation.output, result);

  parser.clear();
}