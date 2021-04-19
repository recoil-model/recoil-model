import recoil, { DefaultValue, useSetRecoilState, useRecoilValue, waitForAll } from 'recoil';
import React from 'react';

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

    if (!(value instanceof DefaultValue) && value && value[_key]) {
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
var validateValue$1 = function validateValue(fields, fieldsB, get) {
  var validateFields = validateValueTree(fields, fieldsB, get);
  var lValidateValueArray = validateValueArray(fields, fieldsB, validateFields);
  var messages = lValidateValueArray.flatMap(function (a) {
    return a.messages;
  }).flatMap(function (e) {
    return e;
  });
  return {
    _$ValidateInfo: true,
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
  var validate = recoil.selector({
    key: [key, '$validate'].join('-'),
    get: function get(_ref) {
      var _get = _ref.get;
      return validateValue$1(props.fields, fields, function (s) {
        return _get(s);
      });
    }
  });
  var value = recoil.selector({
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

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

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
var errorFields = function errorFields(obj) {
  var fields = {};
  var array = [];

  for (var key in obj) {
    var element = obj[key];

    if (element && element._$ValidateInfo) {
      fields[key] = element;
      array.push(fields[key]);
    } else {
      var _errorFields = errorFields(element),
          fieldsA = _errorFields.fields,
          arrayA = _errorFields.array;

      fields[key] = fieldsA;
      array = [array].concat(_toConsumableArray(arrayA));
    }
  }

  return {
    fields: fields,
    array: array
  };
};

var ok = {
  error: false,
  message: null,
  messages: [],
  _$ValidateInfo: true
};

var fields = function fields() {
  var _errorFields2 = errorFields(arguments.length <= 0 ? undefined : arguments[0]),
      fields = _errorFields2.fields,
      array = _errorFields2.array;

  var erros = array.filter(function (e) {
    return e.error;
  });

  if (erros.length == 0) {
    return _objectSpread(_objectSpread({}, ok), {}, {
      fields: fields
    });
  }

  return {
    fields: fields,
    error: true,
    message: erros.map(function (e) {
      return e.message;
    }).join('\n'),
    messages: erros.map(function (e) {
      return e.message;
    }),
    _$ValidateInfo: true
  };
};

var error = function error() {
  for (var _len = arguments.length, msgs = new Array(_len), _key = 0; _key < _len; _key++) {
    msgs[_key] = arguments[_key];
  }

  return {
    error: true,
    message: msgs.join(''),
    messages: msgs,
    _$ValidateInfo: true
  };
};

var validateInfo = {
  fields: fields,
  error: error,
  ok: ok
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
      $default = recoil.selector({
        key: [key, '$value', '$default'].join('-'),
        get: defaultGet
      });
      value = recoil.atom({
        key: [key, '$value'].join('-'),
        "default": $default
      });
    } else {
      value = recoil.atom({
        key: [key, '$value'].join('-'),
        "default": $default
      });
    }

    return {
      validate: recoil.selector({
        key: [key, '$validate'].join('-'),
        get: function get(_ref2) {
          var _get = _ref2.get;

          var v = _get(value);

          if (schemas) {
            try {
              schemas.validateSync(v);
            } catch (e) {
              return validateInfo.error(e.message);
            }
          }

          return validateInfo.ok;
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
var fieldFamilyYup = function fieldFamilyYup(_ref) {
  var schemas = _ref.schemas,
      $default = _ref["default"],
      defaultGet = _ref.defaultGet;

  var f = function f(key, nodeField) {
    var value;

    if (defaultGet) {
      $default = recoil.selectorFamily({
        key: [key, '$value', '$default'].join('-'),
        get: defaultGet
      });
      value = recoil.atomFamily({
        key: [key, '$value'].join('-'),
        "default": $default
      });
    } else {
      value = recoil.atomFamily({
        key: [key, '$value'].join('-'),
        "default": $default
      });
    }

    return {
      validate: recoil.selectorFamily({
        key: [key, '$validate'].join('-'),
        get: function get(params) {
          return function (_ref2) {
            var get = _ref2.get;
            var v = get(value(params));

            if (schemas) {
              try {
                schemas.validateSync(v);
              } catch (e) {
                return validateInfo.error(e.message);
              }
            }

            return validateInfo.ok;
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
var field = function field(_ref) {
  var $default = _ref["default"],
      $validate = _ref.validate,
      defaultGet = _ref.defaultGet;
  var validate = $validate !== null && $validate !== void 0 ? $validate : function () {
    return validateValue.ok;
  };

  var f = function f(key, nodeField) {
    var value;

    if (defaultGet) {
      $default = recoil.selector({
        key: [key, '$value', '$default'].join('-'),
        get: defaultGet
      });
      value = recoil.atom({
        key: [key, '$value'].join('-'),
        "default": $default
      });
    } else {
      value = recoil.atom({
        key: [key, '$value'].join('-'),
        "default": $default
      });
    }

    return {
      validate: recoil.selector({
        key: [key, '$validate'].join('-'),
        get: validate
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
var fieldFamily = function fieldFamily(_ref) {
  var $default = _ref["default"],
      defaultGet = _ref.defaultGet,
      $validate = _ref.validate;
  var validate = $validate !== null && $validate !== void 0 ? $validate : function (params) {
    return function (_ref2) {
      var get = _ref2.get;
      get(value(params));
      return validateValue$1.ok;
    };
  };

  var f = function f(key, nodeField) {
    var value;

    if (defaultGet) {
      $default = recoil.selectorFamily({
        key: [key, '$value', '$default'].join('-'),
        get: defaultGet
      });
      value = recoil.atomFamily({
        key: [key, '$value'].join('-'),
        "default": $default
      });
    } else {
      value = recoil.atomFamily({
        key: [key, '$value'].join('-'),
        "default": $default
      });
    }

    return {
      validate: recoil.selectorFamily({
        key: [key, '$validate'].join('-'),
        get: validate
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
  var validate = recoil.selectorFamily({
    key: [key, '$validate'].join('-'),
    get: function get(param) {
      return function (_ref) {
        var get = _ref.get;
        return validateValue$1(props.fields, fields, function (s) {
          return get(s(param));
        });
      };
    }
  });
  var value = recoil.selectorFamily({
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

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

var RecoilModelField = function RecoilModelField(props) {
  var valueRecoilState;
  var validateRecoilState;
  var field = props.field;
  var param = props.param;
  var CC = props.component;

  if (typeof field.value == 'function') {
    valueRecoilState = field.value(param);
  }

  if (typeof field.validate == 'function') {
    validateRecoilState = field.validate(param);
  }

  var setValue = useSetRecoilState(valueRecoilState);

  var _useRecoilValue = useRecoilValue(waitForAll([valueRecoilState, validateRecoilState])),
      _useRecoilValue2 = _slicedToArray(_useRecoilValue, 2),
      value = _useRecoilValue2[0],
      validate = _useRecoilValue2[1];

  return /*#__PURE__*/React.createElement(CC, {
    value: value,
    setValue: setValue,
    validate: validate
  });
};

export { RecoilModelField, field, fieldFamily, fieldFamilyYup, fieldYup, model, modelFamily, validateInfo };
