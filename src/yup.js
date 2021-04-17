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
import { validateInfo } from './validate-info';

export const fieldYup = ({ schemas, default: $default, defaultGet }) => {
  const f = (key, nodeField) => {
    let value;
    if (defaultGet) {
      $default = recoil.selector({
        key: [key, '$value', '$default'].join('-'),
        get: defaultGet,
      });
      value = recoil.atom({
        key: [key, '$value'].join('-'),
        default: $default,
      });
    } else {
      value = recoil.atom({
        key: [key, '$value'].join('-'),
        default: $default,
      });
    }
    return {
      validate: recoil.selector({
        key: [key, '$validate'].join('-'),
        get: ({ get }) => {
          const v = get(value);
          if (schemas) {
            try {
              schemas.validateSync(v);
            } catch (e) {
              return validateInfo.error(e.message);
            }
          }
          return validateInfo.ok
        },
      }),
      value,
    };
  };
  f._$ModelField = true;
  return f;
};