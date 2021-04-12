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


import { DefaultValue } from 'recoil';

export const buildFields = props => (
  key,
  nodeField,
  fields,
  itens,
) => {
  if (fields.__$model) {
    fields.fieldsArray.forEach(element => {
      itens.push({
        item: element.item,
        nodeField: [...nodeField, ...element.nodeField],
      });
    });
    return fields.fields;
  }
  if (fields._$ModelField) {
    const item = fields([key, ...nodeField].join('-'), nodeField);
    itens.push({
      item,
      nodeField,
    });
    return item;
  }
  const obj = {};
  // eslint-disable-next-line guard-for-in
  for (const _key in fields) {
    obj[_key] = buildFields(props)(
      key,
      [...nodeField, _key],
      fields[_key],
      itens,
    );
  }
  return obj;
};


export const resetValue = (fields, fieldsB, reset) => {
  if (fields._$ModelField) {
    return reset(fieldsB);
  }
  if (fields.__$model) {
    return reset(fields);
  }
  for (const _key in fields) {
    resetValue(fields[_key], fieldsB[_key], reset);
  }
};


export const setValue = (fields, fieldsB, value, set, reset) => {
  if (fields._$ModelField) {
    return set(fieldsB, value);
  }
  if (fields.__$model) {
    return set(fields, value);
  }
  for (const _key in fields) {
    let v;
    if (!(value instanceof DefaultValue) && value && value[_key]) {
      v = value[_key];
      setValue(fields[_key], fieldsB[_key], v, set, reset);
    } else {
      resetValue(fields[_key], fieldsB[_key], reset);
    }
  }
};

export const validateValueArray = (fields, fieldsB, validateFields) => {
  if (fields._$ModelField) {
    return [validateFields]
  }
  if (fields.__$model) {
    return [validateFields]
  }
  let array = [];
  for (const _key in fields) {
    array = [...array, ...validateValueArray(fields[_key], fieldsB[_key], validateFields[_key])];
  }
  return array;
};

export const validateValueTree = (fields, fieldsB, get) => {
  if (fields._$ModelField) {
    return get(fieldsB.validate)
  }
  if (fields.__$model) {
    return get(fieldsB.validate)
  }
  let obj = {};
  for (const _key in fields) {
    obj[_key] = validateValueTree(fields[_key], fieldsB[_key], get);
  }
  return obj;
};
export const validateValue = (fields, fieldsB, get) => {
  const validateFields = validateValueTree(fields, fieldsB, get);
  const lValidateValueArray = validateValueArray(fields, fieldsB, validateFields);
  const messages = lValidateValueArray.flatMap(a => a.messages).flatMap(e => e);
  return {
    fields: validateFields,
    messages,
    message: messages.length > 0 ? messages.join("\n") : null,
    error: messages.length > 0
  }
}


export const getValue = (fields, fieldsB, get) => {
  if (fields._$ModelField) {
    return get(fieldsB);
  }
  if (fields.__$model) {
    return get(fields);
  }
  const obj = {};
  // eslint-disable-next-line guard-for-in
  for (const _key in fields) {
    obj[_key] = getValue(fields[_key], fieldsB[_key], get);
  }
  return obj;
};
