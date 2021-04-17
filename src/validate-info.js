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

const errorFields = (obj) => {
  let fields = {}
  let array = [];
  for (const key in obj) {
    let element = obj[key]
    if (element && element._$ValidateInfo) {
      fields[key] = element
      array.push(fields[key]);
    }
    else {
      const { fields: fieldsA, array: arrayA } = errorFields(element)
      fields[key] = fieldsA;
      array = [array, ...arrayA]
    }
  }
  return { fields: fields, array };
}
const ok = {
  error: false,
  message: null,
  messages: [],
  _$ValidateInfo: true
}

const fields = (...msgs) => {
  const { fields, array } = errorFields(msgs[0]);
  const erros = array.filter(e => e.error)
  if (erros.length == 0) {
    return {
      ...ok,
      fields
    }
  }
  return ({
    fields,
    error: true,
    message: erros.map(e => e.message).join('\n'),
    messages: erros.map(e => e.message),
    _$ValidateInfo: true
  })
};

const error = (...msgs) => {
  return ({
    error: true,
    message: msgs.join(''),
    messages: msgs,
    _$ValidateInfo: true
  })
};
export const validateInfo = {
  fields,
  error,
  ok
}