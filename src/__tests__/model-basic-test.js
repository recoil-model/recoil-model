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

import { model } from '../model';
import { fieldYup } from '../yup';
import { snapshot_UNSTABLE } from 'recoil';

describe('model-basic-test', () => {
  const personModel = model({
    key: 'model-basic-test',
    fields: {
      name: fieldYup({
        default: '',
      }),
      email: fieldYup({
        default: '',
      }),
    },
  });
  test('model-basic-test', done => {
    snapshot_UNSTABLE(async ({ set, reset, getPromise }) => {
      set(personModel.value, {
        name: 'Eric fillipe',
        email: ''
      });
      await expect(getPromise(personModel.value))
        .resolves
        .toEqual({
          name: 'Eric fillipe',
          email: ''
        });
      set(personModel.fields.email.value, 'ericfillipework@gmail.com');
      await expect(getPromise(personModel.fields.email.value))
        .resolves
        .toEqual('ericfillipework@gmail.com');

      await expect(getPromise(personModel.value))
        .resolves
        .toEqual({
          name: 'Eric fillipe',
          email: 'ericfillipework@gmail.com'
        });
      reset(personModel.value);
      await expect(getPromise(personModel.value))
        .resolves
        .toEqual({
          name: '',
          email: ''
        });
      done();
    });
  });
});