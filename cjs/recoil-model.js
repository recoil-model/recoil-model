/*
 *   Copyright (c) 2021 Eric Fillipe
 *   All rights reserved.

 *   Permission is hereby granted, free of charge, to any person obtaining a copy
 *   of this software and associated documentation files (the "Software"), to deal
 *   in the Software without restriction, including without limitation the rights
 *   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *   copies of the Software, and to permit persons to whom the Software is
 *   furnished to do so, subject to the following conditions:
 
 *   The above copyright notice and this permission notice shall be included in all
 *   copies or substantial portions of the Software.
 
 *   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *   SOFTWARE.
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var recoil = require('recoil');

function _interopDefaultLegacy(e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var recoil__default = /*#__PURE__*/_interopDefaultLegacy(recoil);

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

var buildFields = function buildFields(props) {
  return function (key, nodeField, fields, itens) {
    if (fields.__$model) {
      fields.fieldsArray.forEach(function (element) {
        itens.push({
          item: element.item,
          nodeField: [].concat(_toConsumableArray(nodeField), _toConsumableArray(element.nodeField))
        });
      });
      return fields.fields;
    }

    if (fields._$ModelField) {
      var item = fields([key].concat(_toConsumableArray(nodeField)).join('-'), nodeField);
      itens.push({
        item: item,
        nodeField: nodeField
      });
      return item;
    }

    var obj = {}; // eslint-disable-next-line guard-for-in

    for (var _key in fields) {
      obj[_key] = buildFields()(key, [].concat(_toConsumableArray(nodeField), [_key]), fields[_key], itens);
    }

    return obj;
  };
};
var resetValue = function resetValue(fields, fieldsB, reset) {
  if (fields._$ModelField) {
    return reset(fieldsB);
  }

  if (fields.__$model) {
    return reset(fields);
  }

  for (var _key in fields) {
    resetValue(fields[_key], fieldsB[_key], reset);
  }
};
var setValue = function setValue(fields, fieldsB, value, set, reset) {
  if (fields._$ModelField) {
    return set(fieldsB, value);
  }

  if (fields.__$model) {
    return set(fields, value);
  }

  for (var _key in fields) {
    var v = void 0;

    if (!(value instanceof recoil.DefaultValue) && value && value[_key]) {
      v = value[_key];
      setValue(fields[_key], fieldsB[_key], v, set, reset);
    } else {
      resetValue(fields[_key], fieldsB[_key], reset);
    }
  }
};
var validateValueArray = function validateValueArray(fields, fieldsB, validateFields) {
  if (fields._$ModelField) {
    return [validateFields];
  }

  if (fields.__$model) {
    return [validateFields];
  }

  var array = [];

  for (var _key in fields) {
    array = [].concat(_toConsumableArray(array), _toConsumableArray(validateValueArray(fields[_key], fieldsB[_key], validateFields[_key])));
  }

  return array;
};
var validateValueTree = function validateValueTree(fields, fieldsB, get) {
  if (fields._$ModelField) {
    return get(fieldsB.validate);
  }

  if (fields.__$model) {
    return get(fieldsB.validate);
  }

  var obj = {};

  for (var _key in fields) {
    obj[_key] = validateValueTree(fields[_key], fieldsB[_key], get);
  }

  return obj;
};
var validateValue = function validateValue(fields, fieldsB, get) {
  var validateFields = validateValueTree(fields, fieldsB, get);
  var lValidateValueArray = validateValueArray(fields, fieldsB, validateFields);
  var messages = lValidateValueArray.flatMap(function (a) {
    return a.messages;
  }).flatMap(function (e) {
    return e;
  });
  return {
    fields: validateFields,
    messages: messages,
    message: messages.length > 0 ? messages.join("\n") : null,
    error: messages.length > 0
  };
};
var getValue = function getValue(fields, fieldsB, get) {
  if (fields._$ModelField) {
    return get(fieldsB);
  }

  if (fields.__$model) {
    return get(fields);
  }

  var obj = {}; // eslint-disable-next-line guard-for-in

  for (var _key in fields) {
    obj[_key] = getValue(fields[_key], fieldsB[_key], get);
  }

  return obj;
};

/*
 *   Copyright (c) 2021 Eric Fillipe
 *   All rights reserved.

 *   Permission is hereby granted, free of charge, to any person obtaining a copy
 *   of this software and associated documentation files (the "Software"), to deal
 *   in the Software without restriction, including without limitation the rights
 *   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *   copies of the Software, and to permit persons to whom the Software is
 *   furnished to do so, subject to the following conditions:
 
 *   The above copyright notice and this permission notice shall be included in all
 *   copies or substantial portions of the Software.
 
 *   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *   SOFTWARE.
 */
var model = function model(props) {
  var key = props.key;
  var fieldsArray = [];
  var fields = buildFields()([key, '$fields'].join('-'), [], props.fields, fieldsArray);
  var validate = recoil__default['default'].selector({
    key: [key, '$validate'].join('-'),
    get: function get(_ref) {
      var _get = _ref.get;
      return validateValue(props.fields, fields, function (s) {
        return _get(s);
      });
    }
  });
  var value = recoil__default['default'].selector({
    key: [key, '$value'].join('-'),
    get: function get(_ref2) {
      var _get2 = _ref2.get;
      return getValue(props.fields, fields, function (field) {
        return _get2(field.value);
      });
    },
    set: function set(_ref3, value) {
      var _set = _ref3.set,
        reset = _ref3.reset;
      return setValue(props.fields, fields, value, function (field, value) {
        return _set(field.value, value);
      }, function (field) {
        return reset(field.value);
      });
    }
  });
  return {
    fields: fields,
    fieldsArray: fieldsArray,
    validate: validate,
    value: value,
    __$model: true
  };
};

/*
 *   Copyright (c) 2021 Eric Fillipe
 *   All rights reserved.

 *   Permission is hereby granted, free of charge, to any person obtaining a copy
 *   of this software and associated documentation files (the "Software"), to deal
 *   in the Software without restriction, including without limitation the rights
 *   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *   copies of the Software, and to permit persons to whom the Software is
 *   furnished to do so, subject to the following conditions:
 
 *   The above copyright notice and this permission notice shall be included in all
 *   copies or substantial portions of the Software.
 
 *   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *   SOFTWARE.
 */
var fieldYup = function fieldYup(_ref) {
  var schemas = _ref.schemas,
    $default = _ref["default"],
    defaultGet = _ref.defaultGet;

  var f = function f(key, nodeField) {
    var value;

    if (defaultGet) {
      $default = recoil__default['default'].selector({
        key: [key, '$value', '$default'].join('-'),
        get: defaultGet
      });
      value = recoil__default['default'].atom({
        key: [key, '$value'].join('-'),
        "default": $default
      });
    } else {
      value = recoil__default['default'].atom({
        key: [key, '$value'].join('-'),
        "default": $default
      });
    }

    return {
      validate: recoil__default['default'].selector({
        key: [key, '$validate'].join('-'),
        get: function get(_ref2) {
          var _get = _ref2.get;

          var v = _get(value);

          if (schemas) {
            var info = {
              path: nodeField.join('.'),
              error: !schemas.isValidSync(v),
              message: null,
              messages: []
            };

            try {
              schemas.validateSync(v);
            } catch (e) {
              info.message = e.message;
              info.messages = [e.message];
            }

            return info;
          }

          return {
            path: nodeField.join('.'),
            error: false,
            message: null,
            messages: []
          };
        }
      }),
      value: value
    };
  };

  f._$ModelField = true;
  return f;
};

/*
 *   Copyright (c) 2021 Eric Fillipe
 *   All rights reserved.

 *   Permission is hereby granted, free of charge, to any person obtaining a copy
 *   of this software and associated documentation files (the "Software"), to deal
 *   in the Software without restriction, including without limitation the rights
 *   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *   copies of the Software, and to permit persons to whom the Software is
 *   furnished to do so, subject to the following conditions:
 
 *   The above copyright notice and this permission notice shall be included in all
 *   copies or substantial portions of the Software.
 
 *   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *   SOFTWARE.
 */
var modelFamily = function modelFamily(props) {
  var key = props.key;
  var fieldsArray = [];
  var fields = buildFields()([key, '$fields'].join('-'), [], props.fields, fieldsArray);
  var validate = recoil__default['default'].selectorFamily({
    key: [key, '$validate'].join('-'),
    get: function get(param) {
      return function (_ref) {
        var get = _ref.get;
        return validateValue(props.fields, fields, function (s) {
          return get(s(param));
        });
      };
    }
  });
  var value = recoil__default['default'].selectorFamily({
    key: [key, '$value'].join('-'),
    get: function get(param) {
      return function (_ref2) {
        var get = _ref2.get;
        return getValue(props.fields, fields, function (field) {
          return get(field.value(param));
        });
      };
    },
    set: function set(param) {
      return function (_ref3, value) {
        var set = _ref3.set,
          reset = _ref3.reset;
        return setValue(props.fields, fields, value, function (field, value) {
          return set(field.value(param), value);
        }, function (field) {
          return reset(field.value(param));
        });
      };
    }
  });
  return {
    fields: fields,
    fieldsArray: fieldsArray,
    validate: validate,
    value: value,
    __$model: true
  };
};

/*
 *   Copyright (c) 2021 Eric Fillipe
 *   All rights reserved.

 *   Permission is hereby granted, free of charge, to any person obtaining a copy
 *   of this software and associated documentation files (the "Software"), to deal
 *   in the Software without restriction, including without limitation the rights
 *   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *   copies of the Software, and to permit persons to whom the Software is
 *   furnished to do so, subject to the following conditions:
 
 *   The above copyright notice and this permission notice shall be included in all
 *   copies or substantial portions of the Software.
 
 *   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *   SOFTWARE.
 */
var fieldFamilyYup = function fieldFamilyYup(_ref) {
  var schemas = _ref.schemas,
    $default = _ref["default"],
    defaultGet = _ref.defaultGet;

  var f = function f(key, nodeField) {
    var value;

    if (defaultGet) {
      $default = recoil__default['default'].selectorFamily({
        key: [key, '$value', '$default'].join('-'),
        get: defaultGet
      });
      value = recoil__default['default'].atomFamily({
        key: [key, '$value'].join('-'),
        "default": $default
      });
    } else {
      value = recoil__default['default'].atomFamily({
        key: [key, '$value'].join('-'),
        "default": $default
      });
    }

    return {
      validate: recoil__default['default'].selectorFamily({
        key: [key, '$validate'].join('-'),
        get: function get(params) {
          return function (_ref2) {
            var get = _ref2.get;
            var v = get(value(params));

            if (schemas) {
              var info = {
                path: nodeField.join('.'),
                error: !schemas.isValidSync(v),
                message: null,
                messages: []
              };

              try {
                schemas.validateSync(v);
              } catch (e) {
                info.message = e.message;
                info.messages = [e.message];
              }

              return info;
            }

            return {
              path: nodeField.join('.'),
              error: false,
              message: null,
              messages: []
            };
          };
        }
      }),
      value: value
    };
  };

  f._$ModelField = true;
  return f;
};

exports.fieldFamilyYup = fieldFamilyYup;
exports.fieldYup = fieldYup;
exports.model = model;
exports.modelFamily = modelFamily;
