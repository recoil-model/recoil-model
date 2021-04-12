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
import * as YUP from 'yup';
import { snapshot_UNSTABLE } from 'recoil';

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
        .toEqual({
          "error": true,
          "fields": {
            "email": {
              "error": true,
              "message": "field email is required",
              "messages": ["field email is required"],
              "path": "email"
            },
            "name": {
              "error": true,
              "message": "field name is required",
              "messages": ["field name is required"],
              "path": "name"
            }
          },
          "message": "field name is required\nfield email is required",
          "messages": ["field name is required", "field email is required"]
        });
      set(personModel.value, {
        name: 'Eric fillipe',
        email: 'Erid$gmail.com'
      });
      await expect(getPromise(personModel.validate))
        .resolves
        .toEqual({
          "error": true,
          "fields": {
            "email": {
              "error": true,
              "message": "this must be a valid email",
              "messages": ["this must be a valid email"],
              "path": "email"
            },
            "name": {
              "error": false,
              "message": null,
              "messages": [],
              "path": "name"
            }
          },
          "message": "this must be a valid email",
          "messages": ["this must be a valid email"]
        });

      set(personModel.fields.email.value, 'ericfillipework@gmail.com');

      await expect(getPromise(personModel.validate))
        .resolves
        .toEqual({
          "error": false,
          "fields": {
            "email": {
              "error": false,
              "message": null,
              "messages": [],
              "path": "email"
            },
            "name": {
              "error": false,
              "message": null,
              "messages": [],
              "path": "name"
            }
          },
          "message": null,
          "messages": []
        });
      done();
    });
  });
});
