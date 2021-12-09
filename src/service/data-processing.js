const DataProcessingModel = require('../data/models/data-processing');
const math = require('mathjs');

const error = {message: 'JSON inválido', code: 400};

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

const processData = async(formData, templateVar) => {
  let variables = {};
  try {

    let version = formData.templateVersion;
    let dataProcessing = await getProcessData(version);

    for (let i in templateVar.variables) {
      setVariable(templateVar.variables[i], templateVar.values[i], variables);
    }

    compute(dataProcessing, variables);

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


function setVariable(variable, value, variables) {
  variables[variable] = value;
}

function getVariable(variable, variables) {
  return variables[variable];
}

function compute(data, variables) {
  let operations = data.operations;

  for (let i = 0; i < operations.length; i++) {
    let operation = operations[i];
    switch (operation.type) {
      case 'Table':
        computeTable(operation, variables);
        break;
      case 'Math':
        computeMath(operation, variables);
        break;
      default:
        break;
    }
  }

}

function recursiveTable(input, table, variables) {
  if (input.length === 0)
    throw error;

  let variable = input[0];
  let new_table;

  switch (variable.type) {
    case 'text':
      new_table = table[getVariable(variable.label, variables)];
      break;
    case 'number':
      let y = getVariable(variable.label, variables);
      let passou = false;

      for (let key in table) {
        let op = key.substr(0, 2);
        let aux = key.substr(2, key.length);
        let aux2 = aux.split('_');
        let x1 = parseFloat(aux2[0]);
        let x2 = parseFloat(aux2[1]);
        let cmp = null;

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

        if (cmp) {
          new_table = table[key];
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

  if (new_table === {})
    throw error;

  if (input.length === 1)
    return new_table;

  let new_input = input;
  new_input.shift();

  return recursiveTable(new_input, new_table);

}

function computeTable(operation, variables) {
  let input = JSON.parse(JSON.stringify(operation.input));
  let output = recursiveTable(
    input, operation.body, variables);
  setVariable(operation.output, output, variables);
}

const parser = math.parser();

function computeMath(operation, variables) {

  operation.input.forEach(
    (variable, i) => {
      parser.set(variable, getVariable(variable, variables));
    },
  );

  let result = parser.evaluate(operation.body);
  setVariable(operation.output, result, variables);

  parser.clear();
}