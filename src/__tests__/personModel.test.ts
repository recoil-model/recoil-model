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

import { snapshot_UNSTABLE } from 'recoil';
import { field } from '../core/field';
import { model } from '../core/model';
describe('personModel', () => {
  const personModel = model(
    'personModel',
  ).addFields({
    name: field.default(''),
    email: field.default('')
  }).build();

  test('personModel', done => {
    snapshot_UNSTABLE(async ({ set, reset, getPromise }) => {
      set(personModel.rawState, {
        name: 'Eric fillipe',
        email: ''
      });
      await expect(getPromise(personModel.rawState))
        .resolves
        .toEqual({
          name: 'Eric fillipe',
          email: ''
        });
      set(personModel.fields.email.state, 'ericfillipework@gmail.com');
      await expect(getPromise(personModel.fields.email.state))
        .resolves
        .toEqual('ericfillipework@gmail.com');

      await expect(getPromise(personModel.state))
        .resolves
        .toEqual({
          name: 'Eric fillipe',
          email: 'ericfillipework@gmail.com'
        });
      reset(personModel.state);
      await expect(getPromise(personModel.state))
        .resolves
        .toEqual({
          name: '',
          email: ''
        });
      done();
    });
  });
});
