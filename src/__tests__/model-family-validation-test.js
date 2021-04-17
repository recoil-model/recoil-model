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

import { modelFamily } from '../model-family';
import { fieldFamilyYup } from '../yup-family';
import { validateInfo } from '../validate-info';
import * as YUP from 'yup';
import { snapshot_UNSTABLE } from 'recoil';

describe('model-family-validation-test', () => {
  const personModel = modelFamily({
    key: 'model-family-validation-test',
    fields: {
      name: fieldFamilyYup({
        default: '',
        schemas: YUP.string().required("field name is required"),
      }),
      email: fieldFamilyYup({
        default: '',
        schemas: YUP.string().email().required("field email is required"),
      }),
    },
  });
  const id = "21";
  test('model-family-validation-test', done => {
    snapshot_UNSTABLE(async ({ set, getPromise }) => {
      await expect(getPromise(personModel.validate(id)))
        .resolves
        .toEqual(
          validateInfo.fields({
            "name": validateInfo.error("field name is required"),
            "email": validateInfo.error("field email is required"),
          })
        );
      set(personModel.value(id), {
        name: 'Eric fillipe',
        email: 'Erid$gmail.com'
      });
      await expect(getPromise(personModel.validate(id)))
        .resolves
        .toEqual(
          validateInfo.fields({
            "name": validateInfo.ok,
            "email": validateInfo.error("this must be a valid email"),
          }));

      set(personModel.fields.email.value(id), 'ericfillipework@gmail.com');

      await expect(getPromise(personModel.validate(id)))
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
