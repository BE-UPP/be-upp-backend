const DataProcessingModel = require('../data/models/data-processing');
const {
  getLatestTemplate,
} = require('../service/template');
const math = require('mathjs');
const moment = require('moment');
const {clone} = require('../service/helper');

function ErrorJson() {
  const e = new Error('JSON inválido');
  return e;
};
ErrorJson.prototype = Object.create(Error.prototype);

const addProcessData = async(_data) => {
  try {
    let data = clone(_data);
    if (data.version === null || data.version === undefined) {
      data.version = (await getLatestTemplate()).templateVersion;
    }
    await DataProcessingModel.find({version: data.version}).remove().exec();
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
    const dado = await DataProcessingModel.findOne({
      version: version,
    }).exec();
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
    console.log(variables);

    return variables;

  } catch (error) {
    console.log(error);
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
    try {
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
          date = date.add(-y, 'years');
          let m = date.diff(date2, 'months');
          date = date.add(-m, 'months');
          let d = date.diff(date2, 'days');

          setVariable(operation.output[0], y, variables);
          setVariable(operation.output[1], m, variables);
          setVariable(operation.output[2], d, variables);

          break;
        case 'String':
          let s = '';

          for (let x of operation.input) {
            let y = getVariable(x.variable, variables);
            switch (x.validation) {
              case 'bool':
                if (y && y === true)
                  s += x.label + ', ';
                break;
              case 'equal':
                if (y && y === x.value)
                  s += x.label + ', ';
                else if (y && x.else)
                  s += x.else + ', ';
                break;
              case 'empty':
                if (y === '')
                  s += x.label + ', ';
                break;
              default:
                if (y && y !== '') {
                  if (x.label)
                    s += x.label + ', ';
                  else
                    s += y + ', ';
                }
                break;
            }
          }
          if (s.slice(s.length - 2, s.length) === ', ') {
            s = s.slice(0, -2);
          // s += '.';
          }

          setVariable(operation.output, s, variables);

          break;
        case 'Sum' :
          let aux = 0;

          for (let x of operation.input) {
            let y = getVariable(x, variables);
            if (typeof y === 'number')
              aux += y;
            else if (typeof y === 'boolean')
              aux += y ? 1 : 0;
          }

          setVariable(operation.output, aux, variables);
          break;
        default:
          break;
      }
    } catch (error) {
      if (error.message === 'JSON inválido')
        throw error;
      console.log(error);
    }
  }

}

function recursiveTable(input, table, variables) {
  if (input.length === 0)
    throw new ErrorJson();

  let variable = input[0];
  let new_table;

  // console.log(variables);
  // console.log(input);
  // console.log(variable);
  // console.log(table);

  switch (variable.type) {
    case 'text':
      new_table = table[getVariable(variable.label, variables)];
      break;
    case 'number':
      let y = parseFloat(getVariable(variable.label, variables));
      let passou = false;

      for (let key in table) {
        let op = key.substr(0, 2);
        let aux = key.substr(2, key.length);
        let aux2 = aux.split('_');
        if (aux[0] !== undefined)
          aux2[0] = aux2[0].replace(',', '.');
        if (aux2.length > 1 && aux[1] !== undefined)
          aux2[1] = aux2[1].replace(',', '.');
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
            throw new ErrorJson();
        }

        if (cmp) {
          new_table = table[key];
          passou = true;
          break;
        }
      }

      if (!passou) {
        return null;
      }
      break;
    default:
      throw new ErrorJson();
  }

  if (input.length !== 1 && new_table === {})
    throw new ErrorJson();

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

  if (output === null) {
    output = [];
    operation.output.forEach(() => {
      output.push(null);
    });
  }

  if (Array.isArray(output) === false)
    output = [output];

  for (let i in operation.output) {
    if (output[i] !== null && output[i] !== undefined && typeof output[i] === 'object') {
      if (output[i].type === 'variable') {
        let y = getVariable(output[i].variable, variables);
        setVariable(operation.output[i], y, variables);
      } else if (output[i].type === 'increment') {
        let value = output[i].value;
        if (value === null || value === undefined)
          value = 1;

        let y = getVariable(operation.output[i], variables) + value;
        setVariable(operation.output[i], y, variables);
      } else if (output[i].type === null || output[i].type === undefined) {
      }
    } else
      setVariable(operation.output[i], output[i], variables);
  }
}

const parser = math.parser();

function computeMath(operation, variables) {
  operation.input.forEach(
    (variable, i) => {
      let value = getVariable(variable, variables);
      if (value === null || value === undefined)
        value = 0;
      parser.set(variable, value);
    },
  );
  // console.log(variables);
  // console.log(operation);
  let result = parser.evaluate(operation.body);
  setVariable(operation.output, result, variables);

  parser.clear();
}
