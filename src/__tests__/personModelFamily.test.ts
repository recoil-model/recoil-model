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

import { modelFamily } from '../core/model';
import { snapshot_UNSTABLE } from 'recoil';
import { field, fieldFamily } from '../core/field';

describe('personModelFamily', () => {
  const personModelFamily = modelFamily('personModelFamily')
    .addFields({
      id: fieldFamily.default(id => id),
      name: fieldFamily.default(''),
      email: fieldFamily.default(''),
    })
    .mapKey(e => e.id)
    .build();
  const id = "01";
  test('personModelFamily', done => {
    snapshot_UNSTABLE(async ({ set, reset, getPromise }) => {
      set(personModelFamily.rawState(id), {
        id: "01",
        name: 'Eric fillipe',
        email: ''
      });
      await expect(getPromise(personModelFamily.rawState(id)))
        .resolves
        .toEqual({
          id: "01",
          name: 'Eric fillipe',
          email: ''
        });
      set(personModelFamily.fields.email.rawState(id), 'ericfillipework@gmail.com');
      await expect(getPromise(personModelFamily.fields.email.rawState(id)))
        .resolves
        .toEqual('ericfillipework@gmail.com');

      await expect(getPromise(personModelFamily.rawState(id)))
        .resolves
        .toEqual({

          id: "01",
          name: 'Eric fillipe',
          email: 'ericfillipework@gmail.com'
        });
      reset(personModelFamily.rawState(id));
      await expect(getPromise(personModelFamily.rawState(id)))
        .resolves
        .toEqual({
          id: "01",
          name: '',
          email: ''
        });
      done();
    });
  });
});
