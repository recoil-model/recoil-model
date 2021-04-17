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

import * as YUP from 'yup';
import { snapshot_UNSTABLE } from 'recoil';
import { model } from '../model';
import { fieldYup } from '../yup';
import { field } from '../field';
import { validateInfo } from '../validate-info';

describe('model-password-reset-test', () => {
  const passwords = model({
    key: 'model-password-reset-test',
    fields: {
      password: fieldYup({
        default: '',
        schemas: YUP.string().required("password name is required"),
      }),
      repeatPassword: field({
        default: '',
        validate: ({ get }) => {
          const password = get(passwords.fields.password.value)
          const repeatPassword = get(passwords.fields.repeatPassword.value)
          if (password != repeatPassword) {
            return validateInfo.error("Your password and confirmation password do not match.")
          }
          return validateInfo.ok;
        }
      }),
    }
  });
  test('model-password-reset-test', done => {
    snapshot_UNSTABLE(async ({ set, getPromise }) => {
      set(passwords.value, {
        password: '15ty',
        repeatPassword: '15ty7'
      });

      await expect(getPromise(passwords.fields.repeatPassword.validate))
        .resolves
        .toEqual(validateInfo.error("Your password and confirmation password do not match."));
      done();
    });
  });
});
