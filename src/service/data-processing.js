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

    for (let i in formData.questions) {
      // console.log(formData.questions[i]);
      let variables = formData.questions[i].variables;
      let values = formData.questions[i].values;

      if (values == null)
        continue;

      for (let i = 0; i < values.length; i += 1) {
        set_variable(variables[i], values[i]);
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


function set_variable(variable, value) {
  variables[variable] = value;
}

function get_variable(variable) {
  return variables[variable];
}

function compute(data) {
  let operations = data.operations;

  for (let i = 0; i < operations.length; i++) {
    let operation = operations[i];
    switch (operation.type) {
      case 'Table':
        compute_table(operation);
        break;
      case 'Math':
        compute_math(operation);
        break;
      default:
        break;
    }
  }

}

function recursive_table(input, table) {
  // console.log('Input:', input);
  // console.log('Table:', table);
  if (input.length === 0)
    throw error;

  let variable = input[0];
  let new_table;
  // console.log("Tipo: ", variable.type)
  switch (variable.type) {
    case 'text':
      new_table = table[get_variable(variable.label)];
      break;
    case 'number':
      let y = get_variable(variable.label);
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

function compute_table(operation) {
  // console.log(operation.input);
  let input = JSON.parse(JSON.stringify(operation.input));
  let output = recursive_table(
    input, operation.body);
  set_variable(operation.output, output);
}

const parser = math.parser();

function compute_math(operation) {

  operation.input.forEach(
    (variable, i) => {
      parser.set(variable, get_variable(variable));
    },
  );

  let result = parser.evaluate(operation.body);
  set_variable(operation.output, result);

  parser.clear();
}
