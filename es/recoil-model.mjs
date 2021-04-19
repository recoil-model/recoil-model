import recoil,{DefaultValue,useSetRecoilState,useRecoilValue,waitForAll}from"recoil";import React from"react";function _arrayLikeToArray(arr,len){(null==len||len>arr.length)&&(len=arr.length);for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2}function _unsupportedIterableToArray(o,minLen){if(o){if("string"==typeof o)return _arrayLikeToArray(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);return"Object"===n&&o.constructor&&(n=o.constructor.name),"Map"===n||"Set"===n?Array.from(o):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?_arrayLikeToArray(o,minLen):void 0}}function _toConsumableArray(arr){return function(arr){if(Array.isArray(arr))return _arrayLikeToArray(arr)}(arr)||function(iter){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(iter))return Array.from(iter)}(arr)||_unsupportedIterableToArray(arr)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var buildFields=function buildFields(props){return function(key,nodeField,fields,itens){if(fields.__$model)return fields.fieldsArray.forEach((function(element){itens.push({item:element.item,nodeField:[].concat(_toConsumableArray(nodeField),_toConsumableArray(element.nodeField))})})),fields.fields;if(fields._$ModelField){var item=fields([key].concat(_toConsumableArray(nodeField)).join("-"),nodeField);return itens.push({item:item,nodeField:nodeField}),item}var obj={};for(var _key in fields)obj[_key]=buildFields()(key,[].concat(_toConsumableArray(nodeField),[_key]),fields[_key],itens);return obj}},resetValue=function resetValue(fields,fieldsB,reset){if(fields._$ModelField)return reset(fieldsB);if(fields.__$model)return reset(fields);for(var _key in fields)resetValue(fields[_key],fieldsB[_key],reset)},setValue=function setValue(fields,fieldsB,value,set,reset){if(fields._$ModelField)return set(fieldsB,value);if(fields.__$model)return set(fields,value);for(var _key in fields){var v=void 0;value instanceof DefaultValue||!value||!value[_key]?resetValue(fields[_key],fieldsB[_key],reset):(v=value[_key],setValue(fields[_key],fieldsB[_key],v,set,reset))}},validateValueArray=function validateValueArray(fields,fieldsB,validateFields){if(fields._$ModelField)return[validateFields];if(fields.__$model)return[validateFields];var array=[];for(var _key in fields)array=[].concat(_toConsumableArray(array),_toConsumableArray(validateValueArray(fields[_key],fieldsB[_key],validateFields[_key])));return array},validateValueTree=function validateValueTree(fields,fieldsB,get){if(fields._$ModelField)return get(fieldsB.validate);if(fields.__$model)return get(fieldsB.validate);var obj={};for(var _key in fields)obj[_key]=validateValueTree(fields[_key],fieldsB[_key],get);return obj},validateValue=function(fields,fieldsB,get){var validateFields=validateValueTree(fields,fieldsB,get),messages=validateValueArray(fields,fieldsB,validateFields).flatMap((function(a){return a.messages})).flatMap((function(e){return e}));return{_$ValidateInfo:!0,fields:validateFields,messages:messages,message:messages.length>0?messages.join("\n"):null,error:messages.length>0}},getValue=function getValue(fields,fieldsB,get){if(fields._$ModelField)return get(fieldsB);if(fields.__$model)return get(fields);var obj={};for(var _key in fields)obj[_key]=getValue(fields[_key],fieldsB[_key],get);return obj},model=function(props){var key=props.key,fieldsArray=[],fields=buildFields()([key,"$fields"].join("-"),[],props.fields,fieldsArray),validate=recoil.selector({key:[key,"$validate"].join("-"),get:function(_ref){var _get=_ref.get;return validateValue(props.fields,fields,(function(s){return _get(s)}))}}),value=recoil.selector({key:[key,"$value"].join("-"),get:function(_ref2){var _get2=_ref2.get;return getValue(props.fields,fields,(function(field){return _get2(field.value)}))},set:function(_ref3,value){var _set=_ref3.set,reset=_ref3.reset;return setValue(props.fields,fields,value,(function(field,value){return _set(field.value,value)}),(function(field){return reset(field.value)}))}});return{fields:fields,fieldsArray:fieldsArray,validate:validate,value:value,__$model:!0}};function _defineProperty(obj,key,value){return key in obj?Object.defineProperty(obj,key,{value:value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);enumerableOnly&&(symbols=symbols.filter((function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable}))),keys.push.apply(keys,symbols)}return keys}function _objectSpread(target){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?ownKeys(Object(source),!0).forEach((function(key){_defineProperty(target,key,source[key])})):Object.getOwnPropertyDescriptors?Object.defineProperties(target,Object.getOwnPropertyDescriptors(source)):ownKeys(Object(source)).forEach((function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key))}))}return target}var errorFields=function errorFields(obj){var fields={},array=[];for(var key in obj){var element=obj[key];if(element&&element._$ValidateInfo)fields[key]=element,array.push(fields[key]);else{var _errorFields=errorFields(element),fieldsA=_errorFields.fields,arrayA=_errorFields.array;fields[key]=fieldsA,array=[array].concat(_toConsumableArray(arrayA))}}return{fields:fields,array:array}},ok={error:!1,message:null,messages:[],_$ValidateInfo:!0},validateInfo={fields:function(){var _errorFields2=errorFields(arguments.length<=0?void 0:arguments[0]),fields=_errorFields2.fields,array=_errorFields2.array,erros=array.filter((function(e){return e.error}));return 0==erros.length?_objectSpread(_objectSpread({},ok),{},{fields:fields}):{fields:fields,error:!0,message:erros.map((function(e){return e.message})).join("\n"),messages:erros.map((function(e){return e.message})),_$ValidateInfo:!0}},error:function(){for(var _len=arguments.length,msgs=new Array(_len),_key=0;_key<_len;_key++)msgs[_key]=arguments[_key];return{error:!0,message:msgs.join(""),messages:msgs,_$ValidateInfo:!0}},ok:ok},fieldYup=function(_ref){var schemas=_ref.schemas,$default=_ref.default,defaultGet=_ref.defaultGet,f=function(key,nodeField){var value;return defaultGet?($default=recoil.selector({key:[key,"$value","$default"].join("-"),get:defaultGet}),value=recoil.atom({key:[key,"$value"].join("-"),default:$default})):value=recoil.atom({key:[key,"$value"].join("-"),default:$default}),{validate:recoil.selector({key:[key,"$validate"].join("-"),get:function(_ref2){var v=(0,_ref2.get)(value);if(schemas)try{schemas.validateSync(v)}catch(e){return validateInfo.error(e.message)}return validateInfo.ok}}),value:value}};return f._$ModelField=!0,f},fieldFamilyYup=function(_ref){var schemas=_ref.schemas,$default=_ref.default,defaultGet=_ref.defaultGet,f=function(key,nodeField){var value;return defaultGet?($default=recoil.selectorFamily({key:[key,"$value","$default"].join("-"),get:defaultGet}),value=recoil.atomFamily({key:[key,"$value"].join("-"),default:$default})):value=recoil.atomFamily({key:[key,"$value"].join("-"),default:$default}),{validate:recoil.selectorFamily({key:[key,"$validate"].join("-"),get:function(params){return function(_ref2){var v=(0,_ref2.get)(value(params));if(schemas)try{schemas.validateSync(v)}catch(e){return validateInfo.error(e.message)}return validateInfo.ok}}}),value:value}};return f._$ModelField=!0,f},field=function(_ref){var $default=_ref.default,$validate=_ref.validate,defaultGet=_ref.defaultGet,validate=null!=$validate?$validate:function(){return validateInfo.ok},f=function(key,nodeField){var value;return defaultGet?($default=recoil.selector({key:[key,"$value","$default"].join("-"),get:defaultGet}),value=recoil.atom({key:[key,"$value"].join("-"),default:$default})):value=recoil.atom({key:[key,"$value"].join("-"),default:$default}),{validate:recoil.selector({key:[key,"$validate"].join("-"),get:validate}),value:value}};return f._$ModelField=!0,f},fieldFamily=function(_ref){var $default=_ref.default,defaultGet=_ref.defaultGet,$validate=_ref.validate,validate=null!=$validate?$validate:function(params){return function(_ref2){return(0,_ref2.get)(value(params)),validateInfo.ok}},f=function(key,nodeField){var value;return defaultGet?($default=recoil.selectorFamily({key:[key,"$value","$default"].join("-"),get:defaultGet}),value=recoil.atomFamily({key:[key,"$value"].join("-"),default:$default})):value=recoil.atomFamily({key:[key,"$value"].join("-"),default:$default}),{validate:recoil.selectorFamily({key:[key,"$validate"].join("-"),get:validate}),value:value}};return f._$ModelField=!0,f},modelFamily=function(props){var key=props.key,fieldsArray=[],fields=buildFields()([key,"$fields"].join("-"),[],props.fields,fieldsArray),validate=recoil.selectorFamily({key:[key,"$validate"].join("-"),get:function(param){return function(_ref){var get=_ref.get;return validateValue(props.fields,fields,(function(s){return get(s(param))}))}}}),value=recoil.selectorFamily({key:[key,"$value"].join("-"),get:function(param){return function(_ref2){var get=_ref2.get;return getValue(props.fields,fields,(function(field){return get(field.value(param))}))}},set:function(param){return function(_ref3,value){var set=_ref3.set,reset=_ref3.reset;return setValue(props.fields,fields,value,(function(field,value){return set(field.value(param),value)}),(function(field){return reset(field.value(param))}))}}});return{fields:fields,fieldsArray:fieldsArray,validate:validate,value:value,__$model:!0}};function _slicedToArray(arr,i){return function(arr){if(Array.isArray(arr))return arr}(arr)||function(arr,i){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(arr)){var _arr=[],_n=!0,_d=!1,_e=void 0;try{for(var _s,_i=arr[Symbol.iterator]();!(_n=(_s=_i.next()).done)&&(_arr.push(_s.value),!i||_arr.length!==i);_n=!0);}catch(err){_d=!0,_e=err}finally{try{_n||null==_i.return||_i.return()}finally{if(_d)throw _e}}return _arr}}(arr,i)||_unsupportedIterableToArray(arr,i)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var RecoilModelField=function(props){var field=props.field,param=props.param,valueRecoilState=field.value,validateRecoilState=field.validate,CC=props.component;"function"==typeof field.value&&(valueRecoilState=field.value(param)),"function"==typeof field.validate&&(validateRecoilState=field.validate(param));var setValue=useSetRecoilState(valueRecoilState),_useRecoilValue2=_slicedToArray(useRecoilValue(waitForAll([valueRecoilState,validateRecoilState])),2),value=_useRecoilValue2[0],validate=_useRecoilValue2[1];return React.createElement(CC,{value:value,setValue:setValue,validate:validate})};export{RecoilModelField,field,fieldFamily,fieldFamilyYup,fieldYup,model,modelFamily,validateInfo};
