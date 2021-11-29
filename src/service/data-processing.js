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

const processData = async(formData) => {
  let variables = {};
  try {

    let version = formData.templateVersion;
    let dataProcessing = await getProcessData(version);

    for (let i in formData.questions) {
      let variablesNames = formData.questions[i].variables;
      let values = formData.questions[i].values;

      if (values == null)
        continue;

      for (let i = 0; i < values.length; i += 1) {
        set_variable(variablesNames[i], values[i], variables);
      }
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


function set_variable(variable, value, variables) {
  variables[variable] = value;
}

function get_variable(variable, variables) {
  return variables[variable];
}

function compute(data, variables) {
  let operations = data.operations;

  for (let i = 0; i < operations.length; i++) {
    let operation = operations[i];
    switch (operation.type) {
      case 'Table':
        compute_table(operation, variables);
        break;
      case 'Math':
        compute_math(operation, variables);
        break;
      default:
        break;
    }
  }

}

function recursive_table(input, table, variables) {
  if (input.length === 0)
    throw error;

  let variable = input[0];
  let new_table;

  switch (variable.type) {
    case 'text':
      new_table = table[get_variable(variable.label, variables)];
      break;
    case 'number':
      let y = get_variable(variable.label, variables);
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

  return recursive_table(new_input, new_table);

}

function compute_table(operation, variables) {
  let input = JSON.parse(JSON.stringify(operation.input));
  let output = recursive_table(
    input, operation.body, variables);
  set_variable(operation.output, output, variables);
}

const parser = math.parser();

function compute_math(operation, variables) {

  operation.input.forEach(
    (variable, i) => {
      parser.set(variable, get_variable(variable, variables));
    },
  );

  let result = parser.evaluate(operation.body);
  set_variable(operation.output, result, variables);

  parser.clear();
}
