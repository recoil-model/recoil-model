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

import recoil from 'recoil';
import { buildFields, getValue, setValue, validateValue } from "./util";
export const model = props => {
  const { key } = props;
  const fieldsArray = [];
  const fields = buildFields(props)(
    [key, '$fields'].join('-'),
    [],
    props.fields,
    fieldsArray,
  );
  const validate = recoil.selector({
    key: [key, '$validate'].join('-'),
    get: ({ get }) => {
      return validateValue(props.fields, fields, (s) => get(s));
    },
  });
  const value = recoil.selector({
    key: [key, '$value'].join('-'),
    get: ({ get }) => {
      return getValue(props.fields, fields, field => {
        return get(field.value);
      });
    },
    set: ({ set, reset }, value) => {
      return setValue(props.fields, fields, value, (field, value) => {
        return set(field.value, value);
      }, (field) => {
        return reset(field.value);
      });
    },
  });
  return {
    fields,
    fieldsArray,
    validate,
    value,
    __$model: true,
  };
};
