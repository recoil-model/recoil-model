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

import { model } from '../core/model';
import { fieldYup } from '../yup';
import * as YUP from 'yup';
import { snapshot_UNSTABLE } from 'recoil';
import { validateInfo } from '../core/validateInfo';

describe('model-validation-test', () => {
  const personModel = model({
    key: 'model-validation-test',
    fields: {
      name: fieldYup({
        default: '',
        schemas: YUP.string().required("field name is required"),
      }),
      email: fieldYup({
        default: '',
        schemas: YUP.string().email().required("field email is required"),
      }),
    },
  });
  test('model-validation-test', done => {
    snapshot_UNSTABLE(async ({ set, getPromise }) => {
      await expect(getPromise(personModel.validate))
        .resolves
        .toEqual(
          validateInfo.fields({
            "name": validateInfo.error("field name is required"),
            "email": validateInfo.error("field email is required"),
          }));
      set(personModel.value, {
        name: 'Eric fillipe',
        email: 'Erid$gmail.com'
      });
      await expect(getPromise(personModel.validate))
        .resolves
        .toEqual(
          validateInfo.fields({
            "name": validateInfo.ok,
            "email": validateInfo.error("this must be a valid email"),
          }));

      set(personModel.fields.email.value, 'ericfillipework@gmail.com');

      await expect(getPromise(personModel.validate))
        .resolves
        .toEqual(
          validateInfo.fields({
            "name": validateInfo.ok,
            "email": validateInfo.ok,
          }));
      done();
    });
  });
});
