import recoil,{DefaultValue}from"recoil";function _arrayLikeToArray(arr,len){(null==len||len>arr.length)&&(len=arr.length);for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2}function _toConsumableArray(arr){return function(arr){if(Array.isArray(arr))return _arrayLikeToArray(arr)}(arr)||function(iter){if("undefined"!=typeof Symbol&&null!=iter[Symbol.iterator]||null!=iter["@@iterator"])return Array.from(iter)}(arr)||function(o,minLen){if(o){if("string"==typeof o)return _arrayLikeToArray(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);return"Object"===n&&o.constructor&&(n=o.constructor.name),"Map"===n||"Set"===n?Array.from(o):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?_arrayLikeToArray(o,minLen):void 0}}(arr)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}function _defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}function _createClass(Constructor,protoProps,staticProps){return protoProps&&_defineProperties(Constructor.prototype,protoProps),staticProps&&_defineProperties(Constructor,staticProps),Constructor}function _defineProperty(obj,key,value){return key in obj?Object.defineProperty(obj,key,{value:value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}function _setPrototypeOf(o,p){return(_setPrototypeOf=Object.setPrototypeOf||function(o,p){return o.__proto__=p,o})(o,p)}function _typeof(obj){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(obj){return typeof obj}:function(obj){return obj&&"function"==typeof Symbol&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj})(obj)}function _possibleConstructorReturn(self,call){return!call||"object"!==_typeof(call)&&"function"!=typeof call?function(self){if(void 0===self)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return self}(self):call}function _getPrototypeOf(o){return(_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(o){return o.__proto__||Object.getPrototypeOf(o)})(o)}function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);enumerableOnly&&(symbols=symbols.filter((function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable}))),keys.push.apply(keys,symbols)}return keys}function _objectSpread(target){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?ownKeys(Object(source),!0).forEach((function(key){_defineProperty(target,key,source[key])})):Object.getOwnPropertyDescriptors?Object.defineProperties(target,Object.getOwnPropertyDescriptors(source)):ownKeys(Object(source)).forEach((function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key))}))}return target}function _createSuper(Derived){var hasNativeReflectConstruct=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var result,Super=_getPrototypeOf(Derived);if(hasNativeReflectConstruct){var NewTarget=_getPrototypeOf(this).constructor;result=Reflect.construct(Super,arguments,NewTarget)}else result=Super.apply(this,arguments);return _possibleConstructorReturn(this,result)}}var ValidateInfo=function ValidateInfo(message,messages,error){_classCallCheck(this,ValidateInfo),this.message=message,this.messages=messages,this.error=error},ValidateInfoModel=function(_ValidateInfo){!function(subClass,superClass){if("function"!=typeof superClass&&null!==superClass)throw new TypeError("Super expression must either be null or a function");subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,writable:!0,configurable:!0}}),superClass&&_setPrototypeOf(subClass,superClass)}(ValidateInfoModel,ValidateInfo);var _super=_createSuper(ValidateInfoModel);function ValidateInfoModel(message,messages,error,fields){var _this;return _classCallCheck(this,ValidateInfoModel),(_this=_super.call(this,message,messages,error)).fields=fields,_this}return ValidateInfoModel}(),errorFields=function errorFields(obj){var fields={},array=[];for(var key in obj){var element=obj[key];if(element instanceof ValidateInfo)fields[key]=element,array.push(fields[key]);else{var _errorFields=errorFields(element),fieldsA=_errorFields.fields,arrayA=_errorFields.array;fields[key]=fieldsA,array=[].concat(_toConsumableArray(array),_toConsumableArray(arrayA))}}return{fields:fields,array:array}},ok=new ValidateInfo(null,[],!1),validateInfo={fields:function(){var _errorFields2=errorFields(arguments.length<=0?void 0:arguments[0]),fields=_errorFields2.fields,array=_errorFields2.array,erros=array.filter((function(e){return e.error}));return 0==erros.length?_objectSpread(_objectSpread({},ok),{},{fields:fields}):new ValidateInfoModel(erros.map((function(e){return e.message})).join("\n"),erros.map((function(e){return e.message})),!0,fields)},error:function(){for(var _len=arguments.length,msgs=new Array(_len),_key=0;_key<_len;_key++)msgs[_key]=arguments[_key];return new ValidateInfo(msgs.length>0?msgs.join(""):null,msgs,!0)},ok:ok},FieldFamily=function(){function FieldFamily(FnBuild){_classCallCheck(this,FieldFamily),this.FnBuild=FnBuild}return _createClass(FieldFamily,[{key:"build",value:function(key,nodeField){var _this$FnBuild=this.FnBuild(key,nodeField),validate=_this$FnBuild.validate,value=_this$FnBuild.value;this.validate=validate,this.value=value}}]),FieldFamily}(),Field=function(){function Field(FnBuild){_classCallCheck(this,Field),this.FnBuild=FnBuild}return _createClass(Field,[{key:"build",value:function(key,nodeField){var _this$FnBuild2=this.FnBuild(key,nodeField),validate=_this$FnBuild2.validate,value=_this$FnBuild2.value;this.validate=validate,this.value=value}}]),Field}(),field=function(props){var _props$validate,validate=null!==(_props$validate=props.validate)&&void 0!==_props$validate?_props$validate:function(){return validateInfo.ok};return new Field((function(key){var value;if(props.defaultSelector){var ldefault=recoil.selector({key:[key,"$value","$default"].join("-"),get:props.defaultSelector});value=recoil.atom({key:[key,"$value"].join("-"),default:ldefault})}else value=recoil.atom({key:[key,"$value"].join("-"),default:props.default});return{validate:recoil.selector({key:[key,"props.validate"].join("-"),get:validate}),value:value}}))},fieldFamily=function(props){var _props$validate2,validate=null!==(_props$validate2=props.validate)&&void 0!==_props$validate2?_props$validate2:function(){return function(_ref){return function(obj){if(null==obj)throw new TypeError("Cannot destructure undefined")}(_ref),validateInfo.ok}};return new FieldFamily((function(key){var value;if(props.defaultSelector){var ldefault=recoil.selectorFamily({key:[key,"$value","$default"].join("-"),get:props.defaultSelector});value=recoil.atomFamily({key:[key,"$value"].join("-"),default:ldefault})}else value=recoil.atomFamily({key:[key,"$value"].join("-"),default:props.default});return{validate:recoil.selectorFamily({key:[key,"props.validate"].join("-"),get:validate}),value:value}}))},ModelFamily=function ModelFamily(props){_classCallCheck(this,ModelFamily);var key=props.key;this.fields=props.fields,buildFields()([key,"$fields"].join("-"),[],props.fields,[]),this.validate=recoil.selectorFamily({key:[key,"$validate"].join("-"),get:function(param){return function(_ref){var get=_ref.get;return validateValueFamily({fields:props.fields,get:get,param:param})}}}),this.value=recoil.selectorFamily({key:[key,"$value"].join("-"),get:function(param){return function(_ref2){var get=_ref2.get;return getValueFamily({fields:props.fields,param:param,get:get})}},set:function(param){return function(_ref3,value){var set=_ref3.set,reset=_ref3.reset;return setValueFamily({param:param,fields:props.fields,set:set,reset:reset,value:value})}}})},Model=function Model(props){_classCallCheck(this,Model);var key=props.key;this.fields=props.fields,buildFields()([key,"$fields"].join("-"),[],props.fields,[]),this.validate=recoil.selector({key:[key,"$validate"].join("-"),get:function(_ref4){var _get=_ref4.get;return validateValue({fields:props.fields,get:_get})}}),this.value=recoil.selector({key:[key,"$value"].join("-"),get:function(_ref5){var _get2=_ref5.get;return getValue({fields:props.fields,get:_get2})},set:function(_ref6,value){var _set=_ref6.set,reset=_ref6.reset;return setValue({fields:props.fields,set:_set,reset:reset,value:value})}})},modelFamily=function(props){return new ModelFamily(props)},model=function(props){return new Model(props)},buildFields=function buildFields(props){return function(key,nodeField,fields,itens){if(fields instanceof FieldFamily||fields instanceof Field)fields.build([key].concat(_toConsumableArray(nodeField)).join("-"),nodeField),itens.push({item:fields,nodeField:nodeField});else for(var _key in fields)buildFields()(key,[].concat(_toConsumableArray(nodeField),[_key]),fields[_key],itens)}},validateValueArrayFamily=function validateValueArrayFamily(props){if(props.fields instanceof FieldFamily)return[props.get(props.fields.validate(props.param))];var array=[];for(var _key in props.fields)array=[].concat(_toConsumableArray(array),_toConsumableArray(validateValueArrayFamily({fields:props.fields[_key],get:props.get,param:props.param})));return array},validateValueTreeFamily=function validateValueTreeFamily(props){if(props.fields instanceof FieldFamily)return props.get(props.fields.validate(props.param));var obj={};for(var _key in props.fields)obj[_key]=validateValueTreeFamily({fields:props.fields[_key],get:props.get,param:props.param});return obj},validateValueFamily=function(props){var validateFields=validateValueTreeFamily(props),messages=validateValueArrayFamily(props).flatMap((function(a){return a.messages})).flatMap((function(e){return e}));return new ValidateInfoModel(messages.length>0?messages.join("\n"):null,messages,messages.length>0,validateFields)},getValueFamily=function getValueFamily(props){var fields=props.fields,get=props.get,param=props.param;if(fields instanceof FieldFamily)return get(fields.value(param));var obj={};for(var _key in fields)obj[_key]=getValueFamily({fields:fields[_key],get:get,param:param});return obj},getValue=function getValue(props){var fields=props.fields,get=props.get;if(fields instanceof Field)return get(fields.value);var obj={};for(var _key in fields)obj[_key]=getValue({fields:fields[_key],get:get});return obj},setValueFamily=function setValueFamily(props){var fields=props.fields,set=props.set,param=props.param,value=props.value,reset=props.reset;if(fields instanceof FieldFamily)set(fields.value(param),value);else for(var _key in fields)value instanceof DefaultValue||!value||!value[_key]?resetValueFamily({fields:fields[_key],reset:reset,param:param}):setValueFamily({fields:fields[_key],set:set,reset:reset,param:param,value:value[_key]})},resetValueFamily=function resetValueFamily(props){var fields=props.fields,param=props.param,reset=props.reset;if(fields instanceof FieldFamily)reset(fields.value(param));else for(var _key in fields)resetValueFamily({fields:fields[_key],reset:reset,param:param})},setValue=function setValue(props){var fields=props.fields,set=props.set,value=props.value,reset=props.reset;if(fields instanceof Field)set(fields.value,value);else for(var _key in fields)value instanceof DefaultValue||!value||!value[_key]?resetValue({fields:fields[_key],reset:reset}):setValue({fields:fields[_key],set:set,reset:reset,value:value[_key]})},resetValue=function resetValue(props){var fields=props.fields,reset=props.reset;if(fields instanceof Field)reset(fields.value);else for(var _key in fields)resetValue({fields:fields[_key],reset:reset})},validateValueArray=function validateValueArray(props){if(props.fields instanceof Field)return[props.get(props.fields.validate)];var array=[];for(var _key in props.fields)array=[].concat(_toConsumableArray(array),_toConsumableArray(validateValueArray({fields:props.fields[_key],get:props.get})));return array},validateValueTree=function validateValueTree(props){if(props.fields instanceof Field)return props.get(props.fields.validate);var obj={};for(var _key in props.fields)obj[_key]=validateValueTree({fields:props.fields[_key],get:props.get});return obj},validateValue=function(props){var validateFields=validateValueTree(props),messages=validateValueArray(props).flatMap((function(a){return a.messages})).flatMap((function(e){return e}));return new ValidateInfoModel(messages.length>0?messages.join("\n"):null,messages,messages.length>0,validateFields)},fieldYup=function(props){return new Field((function(key){var value;if(props.defaultSelector){var ldefault=recoil.selector({key:[key,"$value","$default"].join("-"),get:props.defaultSelector});value=recoil.atom({key:[key,"$value"].join("-"),default:ldefault})}else value=recoil.atom({key:[key,"$value"].join("-"),default:props.default});return{validate:recoil.selector({key:[key,"props.validate"].join("-"),get:function(_ref){var v=(0,_ref.get)(value);if(props.schemas)try{props.schemas.validateSync(v)}catch(e){return validateInfo.error(e.message)}return validateInfo.ok}}),value:value}}))},fieldFamilyYup=function(props){return new FieldFamily((function(key){var value;if(props.defaultSelector){var ldefault=recoil.selectorFamily({key:[key,"$value","$default"].join("-"),get:props.defaultSelector});value=recoil.atomFamily({key:[key,"$value"].join("-"),default:ldefault})}else value=recoil.atomFamily({key:[key,"$value"].join("-"),default:props.default});return{validate:recoil.selectorFamily({key:[key,"props.validate"].join("-"),get:function(params){return function(_ref2){var v=(0,_ref2.get)(value(params));if(props.schemas)try{props.schemas.validateSync(v)}catch(e){return validateInfo.error(e.message)}return validateInfo.ok}}}),value:value}}))};export{field,fieldFamily,fieldFamilyYup,fieldYup,model,modelFamily,validateInfo};