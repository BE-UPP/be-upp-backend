const DataProcessingModel = require('../data/models/data-processing');
const math = require('mathjs');
const moment = require('moment');

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
      case 'Date':
        let date = moment().utcOffset('-0300');
        let date2 = getVariable(operation.input[0], variables);
        date2 = moment(date2, 'D/M/YYYY');

        let y = date.diff(date2, 'years');
        date.add(-y, 'years');
        let m = date.diff(date2, 'months');
        date.add(m, 'months');
        let d = date.diff(date2, 'days');

        setVariable(operation.output[0], y, variables);
        setVariable(operation.output[1], m, variables);
        setVariable(operation.output[2], d, variables);

        break;
      case 'String':
        let s = '';

        for (let x of operation.input){
          switch (x.validation) {
            case 'bool':
              if (getVariable(x.variable, variables) === true)
                s += x.label + ', ';
              break;
            case 'empty':
              if (getVariable(x.variable, variables) === '')
                s += x.label + ', ';
              break;
            default:
              if (getVariable(x.variable, variables) !== '')
                if (x.label)
                  s += x.label + ', ';
                else
                  s += getVariable(x.variable, variables) + ', ';
              break;
          }
        }
        if (s.slice(s.length - 2, s.length) === ', ')
          s = s.slice(0, -2);

        setVariable(operation.output, s, variables);

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

  return recursiveTable(new_input, new_table, variables);

}

function computeTable(operation, variables) {
  let input = JSON.parse(JSON.stringify(operation.input));
  let output = recursiveTable(
    input, operation.body, variables);

  if (Array.isArray(output)) {
    for (let i in operation.output)
      setVariable(operation.output[i], output[i], variables);
  } else
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
