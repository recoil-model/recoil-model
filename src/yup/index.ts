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



import {
    GetRecoilValue,
    RecoilState,
    RecoilValue,
    SerializableParam,
} from 'recoil';
import { BaseSchema } from 'yup';
import recoil from 'recoil';
import { validateInfo } from '../core/validateInfo';
import { Field, FieldFamily } from '../core/field';

type FieldYupProps<T> = {
    schemas?: BaseSchema<any, any, any>;
} & (
        | {
            defaultSelector?: undefined;
            default: RecoilValue<T> | Promise<T> | T;
        }
        | {
            default?: undefined;
            defaultSelector: (opts: {
                get: GetRecoilValue;
            }) => Promise<T> | RecoilValue<T> | T;
        }
    )

export const fieldYup = <T>(props: FieldYupProps<T>) => {

    return new Field((key, nodeField) => {
        let value: RecoilState<T>;
        if (props.defaultSelector) {
            let ldefault = recoil.selector({
                key: [key, '$value', '$default'].join('-'),
                get: props.defaultSelector,
            });
            value = recoil.atom({
                key: [key, '$value'].join('-'),
                default: ldefault,
            });
        } else {
            value = recoil.atom({
                key: [key, '$value'].join('-'),
                default: props.default,
            });
        }
        return {
            validate: recoil.selector({
                key: [key, 'props.validate'].join('-'),
                get: ({ get }) => {
                    const v = get(value);
                    if (props.schemas) {
                        try {
                            props.schemas.validateSync(v);
                        } catch (e) {
                            return validateInfo.error(e.message);
                        }
                    }
                    return validateInfo.ok
                },
            }),
            value,
        };
    });
};
type FieldFamilyYupProps<T, P> = {
    schemas?: BaseSchema<any, any, any>;
} & (
        | {
            defaultSelector?: undefined
            default:
            | RecoilValue<T>
            | Promise<T>
            | T
            | ((param: P) => T | RecoilValue<T> | Promise<T>);
        }
        | {
            default: undefined
            defaultSelector: (
                param: P,
            ) => (opts: {
                get: GetRecoilValue;
            }) => Promise<T> | RecoilValue<T> | T;
        }
    )
export const fieldFamilyYup = <T, P extends SerializableParam>(
    props: FieldFamilyYupProps<T, P>
): FieldFamily<T, P> => {
    return new FieldFamily((key, nodeField) => {
        let value: (param: P) => RecoilState<T>;
        if (props.defaultSelector) {
            let ldefault = recoil.selectorFamily({
                key: [key, '$value', '$default'].join('-'),
                get: props.defaultSelector,
            });
            value = recoil.atomFamily({
                key: [key, '$value'].join('-'),
                default: ldefault,
            });
        } else {
            value = recoil.atomFamily({
                key: [key, '$value'].join('-'),
                default: props.default,
            });
        }
        return {
            validate: recoil.selectorFamily({
                key: [key, 'props.validate'].join('-'),
                get: params => ({ get }) => {
                    const v = get(value(params));
                    if (props.schemas) {
                        try {
                            props.schemas.validateSync(v);
                        } catch (e) {
                            return validateInfo.error(e.message);
                        }
                    }
                    return validateInfo.ok
                },
            }),
            value,
        };
    });
};
