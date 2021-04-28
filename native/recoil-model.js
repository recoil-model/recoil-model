import recoil, { DefaultValue } from 'recoil';

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
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
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

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _objectDestructuringEmpty(obj) {
  if (obj == null) throw new TypeError("Cannot destructure undefined");
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

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

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

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
var ValidateInfo = function ValidateInfo(message, messages, error) {
  _classCallCheck(this, ValidateInfo);

  this.message = message;
  this.messages = messages;
  this.error = error;
};
var ValidateInfoModel = /*#__PURE__*/function (_ValidateInfo) {
  _inherits(ValidateInfoModel, _ValidateInfo);

  var _super = _createSuper(ValidateInfoModel);

  function ValidateInfoModel(message, messages, error, fields) {
    var _this;

    _classCallCheck(this, ValidateInfoModel);

    _this = _super.call(this, message, messages, error);
    _this.fields = fields;
    return _this;
  }

  return ValidateInfoModel;
}(ValidateInfo);

var errorFields = function errorFields(obj) {
  var fields = {};
  var array = [];

  for (var key in obj) {
    var element = obj[key];

    if (element instanceof ValidateInfo) {
      fields[key] = element;
      array.push(fields[key]);
    } else {
      var _errorFields = errorFields(element),
          fieldsA = _errorFields.fields,
          arrayA = _errorFields.array;

      fields[key] = fieldsA;
      array = [].concat(_toConsumableArray(array), _toConsumableArray(arrayA));
    }
  }

  return {
    fields: fields,
    array: array
  };
};

var ok = new ValidateInfo(null, [], false);

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

  return new ValidateInfoModel(erros.map(function (e) {
    return e.message;
  }).join('\n'), erros.map(function (e) {
    return e.message;
  }), true, fields);
};

var error = function error() {
  for (var _len = arguments.length, msgs = new Array(_len), _key = 0; _key < _len; _key++) {
    msgs[_key] = arguments[_key];
  }

  return new ValidateInfo(msgs.length > 0 ? msgs.join('') : null, msgs, true);
};

var validateInfo = {
  fields: fields,
  error: error,
  ok: ok
};

var FieldFamily = /*#__PURE__*/function () {
  function FieldFamily(FnBuild) {
    _classCallCheck(this, FieldFamily);

    this.FnBuild = FnBuild;
  }

  _createClass(FieldFamily, [{
    key: "build",
    value: function build(key, nodeField) {
      var _this$FnBuild = this.FnBuild(key, nodeField),
          validate = _this$FnBuild.validate,
          value = _this$FnBuild.value;

      this.validate = validate;
      this.value = value;
    }
  }]);

  return FieldFamily;
}();
var Field = /*#__PURE__*/function () {
  function Field(FnBuild) {
    _classCallCheck(this, Field);

    this.FnBuild = FnBuild;
  }

  _createClass(Field, [{
    key: "build",
    value: function build(key, nodeField) {
      var _this$FnBuild2 = this.FnBuild(key, nodeField),
          validate = _this$FnBuild2.validate,
          value = _this$FnBuild2.value;

      this.validate = validate;
      this.value = value;
    }
  }]);

  return Field;
}();
var field = function field(props) {
  var _props$validate;

  var validate = (_props$validate = props.validate) !== null && _props$validate !== void 0 ? _props$validate : function () {
    return validateInfo.ok;
  };
  return new Field(function (key) {
    var value;

    if (props.defaultSelector) {
      var ldefault = recoil.selector({
        key: [key, '$value', '$default'].join('-'),
        get: props.defaultSelector
      });
      value = recoil.atom({
        key: [key, '$value'].join('-'),
        "default": ldefault
      });
    } else {
      value = recoil.atom({
        key: [key, '$value'].join('-'),
        "default": props["default"]
      });
    }

    return {
      validate: recoil.selector({
        key: [key, 'props.validate'].join('-'),
        get: validate
      }),
      value: value
    };
  });
};
var fieldFamily = function fieldFamily(props) {
  var _props$validate2;

  var validate = (_props$validate2 = props.validate) !== null && _props$validate2 !== void 0 ? _props$validate2 : function () {
    return function (_ref) {
      _objectDestructuringEmpty(_ref);

      return validateInfo.ok;
    };
  };
  return new FieldFamily(function (key) {
    var value;

    if (props.defaultSelector) {
      var ldefault = recoil.selectorFamily({
        key: [key, '$value', '$default'].join('-'),
        get: props.defaultSelector
      });
      value = recoil.atomFamily({
        key: [key, '$value'].join('-'),
        "default": ldefault
      });
    } else {
      value = recoil.atomFamily({
        key: [key, '$value'].join('-'),
        "default": props["default"]
      });
    }

    return {
      validate: recoil.selectorFamily({
        key: [key, 'props.validate'].join('-'),
        get: validate
      }),
      value: value
    };
  });
};

var ModelFamily = function ModelFamily(props) {
  _classCallCheck(this, ModelFamily);

  var key = props.key;
  var fieldsArray = [];
  this.fields = props.fields;
  buildFields()([key, '$fields'].join('-'), [], props.fields, fieldsArray);
  this.validate = recoil.selectorFamily({
    key: [key, '$validate'].join('-'),
    get: function get(param) {
      return function (_ref) {
        var get = _ref.get;
        return validateValueFamily({
          fields: props.fields,
          get: get,
          param: param
        });
      };
    }
  });
  this.value = recoil.selectorFamily({
    key: [key, '$value'].join('-'),
    get: function get(param) {
      return function (_ref2) {
        var get = _ref2.get;
        return getValueFamily({
          fields: props.fields,
          param: param,
          get: get
        });
      };
    },
    set: function set(param) {
      return function (_ref3, value) {
        var set = _ref3.set,
            reset = _ref3.reset;
        return setValueFamily({
          param: param,
          fields: props.fields,
          set: set,
          reset: reset,
          value: value
        });
      };
    }
  });
};
var Model = function Model(props) {
  _classCallCheck(this, Model);

  var key = props.key;
  var fieldsArray = [];
  this.fields = props.fields;
  buildFields()([key, '$fields'].join('-'), [], props.fields, fieldsArray);
  this.validate = recoil.selector({
    key: [key, '$validate'].join('-'),
    get: function get(_ref4) {
      var _get = _ref4.get;
      var ddd = validateValue({
        fields: props.fields,
        get: _get
      });
      return ddd;
    }
  });
  this.value = recoil.selector({
    key: [key, '$value'].join('-'),
    get: function get(_ref5) {
      var _get2 = _ref5.get;
      return getValue({
        fields: props.fields,
        get: _get2
      });
    },
    set: function set(_ref6, value) {
      var _set = _ref6.set,
          reset = _ref6.reset;
      return setValue({
        fields: props.fields,
        set: _set,
        reset: reset,
        value: value
      });
    }
  });
};
var modelFamily = function modelFamily(props) {
  return new ModelFamily(props);
};
var model = function model(props) {
  return new Model(props);
};
var buildFields = function buildFields(props) {
  return function (key, nodeField, fields, itens) {
    if (fields instanceof FieldFamily || fields instanceof Field) {
      fields.build([key].concat(_toConsumableArray(nodeField)).join('-'), nodeField);
      itens.push({
        item: fields,
        nodeField: nodeField
      });
    } else {
      for (var _key in fields) {
        buildFields()(key, [].concat(_toConsumableArray(nodeField), [_key]), fields[_key], itens);
      }
    }
  };
};

var validateValueArrayFamily = function validateValueArrayFamily(props) {
  if (props.fields instanceof FieldFamily) {
    return [props.get(props.fields.validate(props.param))];
  } else {
    var array = [];

    for (var _key in props.fields) {
      array = [].concat(_toConsumableArray(array), _toConsumableArray(validateValueArrayFamily({
        fields: props.fields[_key],
        get: props.get,
        param: props.param
      })));
    }

    return array;
  }
};

var validateValueTreeFamily = function validateValueTreeFamily(props) {
  if (props.fields instanceof FieldFamily) {
    return props.get(props.fields.validate(props.param));
  } else {
    var obj = {};

    for (var _key in props.fields) {
      obj[_key] = validateValueTreeFamily({
        fields: props.fields[_key],
        get: props.get,
        param: props.param
      });
    }

    return obj;
  }
};

var validateValueFamily = function validateValueFamily(props) {
  var validateFields = validateValueTreeFamily(props);
  var lValidateValueArray = validateValueArrayFamily(props);
  var messages = lValidateValueArray.flatMap(function (a) {
    return a.messages;
  }).flatMap(function (e) {
    return e;
  });
  return new ValidateInfoModel(messages.length > 0 ? messages.join("\n") : null, messages, messages.length > 0, validateFields);
};

var getValueFamily = function getValueFamily(props) {
  var fields = props.fields,
      get = props.get,
      param = props.param;

  if (fields instanceof FieldFamily) {
    return get(fields.value(param));
  } else {
    var obj = {};

    for (var _key in fields) {
      obj[_key] = getValueFamily({
        fields: fields[_key],
        get: get,
        param: param
      });
    }

    return obj;
  }
};

var getValue = function getValue(props) {
  var fields = props.fields,
      get = props.get;

  if (fields instanceof Field) {
    return get(fields.value);
  } else {
    var obj = {};

    for (var _key in fields) {
      obj[_key] = getValue({
        fields: fields[_key],
        get: get
      });
    }

    return obj;
  }
};

var setValueFamily = function setValueFamily(props) {
  var fields = props.fields,
      set = props.set,
      param = props.param,
      value = props.value,
      reset = props.reset;

  if (fields instanceof FieldFamily) {
    set(fields.value(param), value);
  } else {
    for (var _key in fields) {
      if (!(value instanceof DefaultValue) && value && value[_key]) {
        setValueFamily({
          fields: fields[_key],
          set: set,
          reset: reset,
          param: param,
          value: value[_key]
        });
      } else {
        resetValueFamily({
          fields: fields[_key],
          reset: reset,
          param: param
        });
      }
    }
  }
};

var resetValueFamily = function resetValueFamily(props) {
  var fields = props.fields,
      param = props.param,
      reset = props.reset;

  if (fields instanceof FieldFamily) {
    reset(fields.value(param));
  } else {
    for (var _key in fields) {
      resetValueFamily({
        fields: fields[_key],
        reset: reset,
        param: param
      });
    }
  }
};

var setValue = function setValue(props) {
  var fields = props.fields,
      set = props.set,
      value = props.value,
      reset = props.reset;

  if (fields instanceof Field) {
    set(fields.value, value);
  } else {
    for (var _key in fields) {
      if (!(value instanceof DefaultValue) && value && value[_key]) {
        setValue({
          fields: fields[_key],
          set: set,
          reset: reset,
          value: value[_key]
        });
      } else {
        resetValue({
          fields: fields[_key],
          reset: reset
        });
      }
    }
  }
};

var resetValue = function resetValue(props) {
  var fields = props.fields,
      reset = props.reset;

  if (fields instanceof Field) {
    reset(fields.value);
  } else {
    for (var _key in fields) {
      resetValue({
        fields: fields[_key],
        reset: reset
      });
    }
  }
};

var validateValueArray = function validateValueArray(props) {
  if (props.fields instanceof Field) {
    return [props.get(props.fields.validate)];
  } else {
    var array = [];

    for (var _key in props.fields) {
      array = [].concat(_toConsumableArray(array), _toConsumableArray(validateValueArray({
        fields: props.fields[_key],
        get: props.get
      })));
    }

    return array;
  }
};

var validateValueTree = function validateValueTree(props) {
  if (props.fields instanceof Field) {
    return props.get(props.fields.validate);
  } else {
    var obj = {};

    for (var _key in props.fields) {
      obj[_key] = validateValueTree({
        fields: props.fields[_key],
        get: props.get
      });
    }

    return obj;
  }
};

var validateValue = function validateValue(props) {
  var validateFields = validateValueTree(props);
  var lValidateValueArray = validateValueArray(props);
  var messages = lValidateValueArray.flatMap(function (a) {
    return a.messages;
  }).flatMap(function (e) {
    return e;
  });
  return new ValidateInfoModel(messages.length > 0 ? messages.join("\n") : null, messages, messages.length > 0, validateFields);
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
var fieldYup = function fieldYup(props) {
  return new Field(function (key) {
    var value;

    if (props.defaultSelector) {
      var ldefault = recoil.selector({
        key: [key, '$value', '$default'].join('-'),
        get: props.defaultSelector
      });
      value = recoil.atom({
        key: [key, '$value'].join('-'),
        "default": ldefault
      });
    } else {
      value = recoil.atom({
        key: [key, '$value'].join('-'),
        "default": props["default"]
      });
    }

    return {
      validate: recoil.selector({
        key: [key, 'props.validate'].join('-'),
        get: function get(_ref) {
          var _get = _ref.get;

          var v = _get(value);

          if (props.schemas) {
            try {
              props.schemas.validateSync(v);
            } catch (e) {
              return validateInfo.error(e.message);
            }
          }

          return validateInfo.ok;
        }
      }),
      value: value
    };
  });
};
var fieldFamilyYup = function fieldFamilyYup(props) {
  return new FieldFamily(function (key) {
    var value;

    if (props.defaultSelector) {
      var ldefault = recoil.selectorFamily({
        key: [key, '$value', '$default'].join('-'),
        get: props.defaultSelector
      });
      value = recoil.atomFamily({
        key: [key, '$value'].join('-'),
        "default": ldefault
      });
    } else {
      value = recoil.atomFamily({
        key: [key, '$value'].join('-'),
        "default": props["default"]
      });
    }

    return {
      validate: recoil.selectorFamily({
        key: [key, 'props.validate'].join('-'),
        get: function get(params) {
          return function (_ref2) {
            var get = _ref2.get;
            var v = get(value(params));

            if (props.schemas) {
              try {
                props.schemas.validateSync(v);
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
  });
};

export { field, fieldFamily, fieldFamilyYup, fieldYup, model, modelFamily, validateInfo };
