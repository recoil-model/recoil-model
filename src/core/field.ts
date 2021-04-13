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
  DefaultValue,
  GetRecoilValue,
  RecoilState,
  RecoilValue,
  SerializableParam,
} from 'recoil';
import recoil from 'recoil';
import { FieldsFamily, ModelFamily } from './model';
export abstract class AbstractFieldState<T, R> {
  public abstract state: RecoilState<T>;
  public abstract rawState: RecoilState<R>;
  public abstract build(key: string, nodeField: string[]): void
}
export abstract class AbstractFieldStateFamily<T, P extends SerializableParam, R> {
  public abstract state: (param: P) => RecoilState<T>;
  public abstract rawState: (param: P) => RecoilState<R>;
  public abstract build(key: string, nodeField: string[]): void
}

export type AbstractField<T, R> = AbstractFieldState<T, R>
export type AbstractFieldFamily<T, P extends SerializableParam, R> = AbstractFieldStateFamily<T, P, R>

export class FieldDefault<T> extends AbstractFieldState<T, T> {
  public state!: RecoilState<T>;
  public rawState!: RecoilState<T>;
  public build(key: string, nodeField: string[]): void {
    this.state = this.rawState = recoil.atom<T>({
      key: [key, '$state'].join('-'),
      default: this.default,
    });
  }
  default: T | RecoilValue<T> | Promise<T>;
  constructor(
    ldefault:
      | RecoilValue<T>
      | Promise<T>
      | T
      | (RecoilValue<T> | Promise<T>)) {
    super();
    this.default = ldefault;
  }
}


export class FieldDefaultSelector<T> extends AbstractFieldState<T, T> {
  public state!: RecoilState<T>;
  public rawState!: RecoilState<T>;
  public build(key: string, nodeField: string[]): void {
    let ldefault = recoil.selector<T>({
      key: [key, '$state', '$default'].join('-'),
      get: this.defaultSelector,
    });
    this.state = this.rawState = recoil.atom<T>({
      key: [key, '$state'].join('-'),
      default: ldefault,
    });
  }
  constructor(
    public defaultSelector: (opts: {
      get: GetRecoilValue;
    }) => Promise<T> | RecoilValue<T> | T) {
    super();
  }
}


type CollectionOption = {
  onRemove?: 'reset' | 'none'
}
export class FieldModelCollection<T, R, P extends SerializableParam, IFieldsFamily extends FieldsFamily<P>>
  extends AbstractFieldState<T[], P[]> {
  public state!: RecoilState<T[]>;
  public rawState!: RecoilState<P[]>;
  public build(key: string, nodeField: string[]): void {
    const fmc = this;
    const modelFamly = this.modelFamly;
    const opt = this.option;
    if (!fmc.rawState)
      fmc.rawState = recoil.atom<P[]>({
        key: [key, '$rawState'].join('-'),
        default: [],
      });

    fmc.state = recoil.selector<T[]>({
      key: [key, '$state'].join('-'),
      get: ({ get }) => {
        const ksModel = get(fmc.rawState);
        return ksModel.map(k => get(modelFamly.state(k)))

      },
      set: ({ set, get, reset }, values) => {
        if (values == null || values instanceof DefaultValue) {
          const ksModel = get(fmc.rawState);
          if (opt?.onRemove == 'reset') {
            ksModel.forEach(kModel => {
              reset(modelFamly.state(kModel))
            });
          }
          reset(fmc.rawState)
        }
        else {
          values.forEach(v => {
            let kModel = modelFamly.getKey(v as any)
            set(modelFamly.state(kModel), v)
          });
          if (opt?.onRemove == 'reset') {
            const ksModel = get(fmc.rawState).filter(k1 => {
              for (var v of values) {
                let k2 = modelFamly.getKey(v as any)
                if (k2 == k1) {
                  return false;
                }
              }
              return true;
            });
            ksModel.forEach(kModel => {
              reset(modelFamly.state(kModel))
            });
          }
        }
      },
    });
  }

  constructor(
    public modelFamly: ModelFamily<T, R, P, IFieldsFamily>,
    public option?: CollectionOption

  ) {
    super();
  }
}
export class FieldModel<T, R, P extends SerializableParam, IFieldsFamily extends FieldsFamily<P>>
  extends AbstractFieldState<T | null, P | null> {
  public state!: RecoilState<T | null>;
  public rawState!: RecoilState<P | null>;
  public build(key: string, nodeField: string[]): void {
    const fm = this;
    const modelFamly = this.modelFamly;
    if (!fm.rawState)
      fm.rawState = recoil.atom<P | null>({
        key: [key, '$rawState'].join('-'),
        default: null as any,
      });
    fm.state = recoil.selector<T | null>({
      key: [key, '$state'].join('-'),
      get: ({ get }) => {
        const kModel = get(fm.rawState);
        if (!kModel) return null;
        return get(modelFamly.state(kModel))

      },
      set: ({ set, get, reset }, value) => {
        const kModel = get(fm.rawState);
        if (!kModel) return;
        if (value == null || value instanceof DefaultValue) {
          reset(modelFamly.state(kModel))
        }
        else {
          set(modelFamly.state(kModel), value)
          set(fm.rawState, kModel)
        }
      },
    });
  }
  constructor(
    public modelFamly: ModelFamily<T, R, P, IFieldsFamily>) {
    super();
  }
}


export class FieldDefaultSelectorFamily<T, P extends SerializableParam> extends AbstractFieldStateFamily<T, P, T> {
  public state!: (param: P) => RecoilState<T>
  public rawState!: (param: P) => RecoilState<T>
  public default!: (param: P) => recoil.RecoilValueReadOnly<T>;
  public build(key: string, nodeField: string[]) {
    this.default = recoil.selectorFamily<T, P>({
      key: [key, '$state', '$default'].join('-'),
      get: this.defaultSelector,
    });
    this.state = this.rawState = recoil.atomFamily<T, P>({
      key: [key, '$state'].join('-'),
      default: this.default,
    });
  }
  constructor(
    public defaultSelector: (
      param: P,
    ) => (opts: {
      get: GetRecoilValue;
    }) => Promise<T> | RecoilValue<T> | T) {
    super();
  }
}




export class FieldDefaultFamily<T, P extends SerializableParam> extends AbstractFieldStateFamily<T, P, T> {
  public state!: (param: P) => RecoilState<T>
  public rawState!: (param: P) => RecoilState<T>
  default: T | RecoilValue<T> | Promise<T> | ((param: P) => T | RecoilValue<T> | Promise<T>);
  public build(key: string, nodeField: string[]) {
    this.state = this.rawState = recoil.atomFamily<T, P>({
      key: [key, '$state'].join('-'),
      default: this.default,
    });
  }
  constructor(
    _default:
      | RecoilValue<T>
      | Promise<T>
      | T
      | ((param: P) => T | RecoilValue<T> | Promise<T>)) {
    super();
    this.default = _default;
  }
}




export class FieldModelCollectionFamily<T, R, P1 extends SerializableParam, P2 extends SerializableParam, IFieldsFamily extends FieldsFamily<P1>>
  extends AbstractFieldStateFamily<T[], P2, P1[]> {
  public state!: (p: P2) => RecoilState<T[]>;
  public rawState!: (p: P2) => RecoilState<P1[]>;
  public build(key: string, nodeField: string[]): void {
    const fmcf = this;
    const modelFamly = this.modelFamly;
    const option = this.option;
    if (!fmcf.rawState)
      fmcf.rawState = recoil.atomFamily<P1[], P2>({
        key: [key, '$rawState'].join('-'),
        default: [],
      });
    fmcf.state = recoil.selectorFamily<T[], P2>({
      key: [key, '$state'].join('-'),
      get: (p) => ({ get }) => {
        const ksModel = get(fmcf.rawState(p));
        return ksModel.map(k => get(modelFamly.state(k)))
      },
      set: (p) => ({ set, get, reset }, values) => {
        if (values == null || values instanceof DefaultValue) {
          const ksModel = get(fmcf.rawState(p));
          if (option?.onRemove == 'reset') {
            ksModel.forEach(kModel => {
              reset(modelFamly.state(kModel))
            });
          }
          reset(fmcf.rawState(p))
        }
        else {
          values.forEach(v => {
            let kModel = modelFamly.getKey(v as any)
            set(modelFamly.state(kModel), v)
          });
          if (option?.onRemove == 'reset') {
            const ksModel = get(fmcf.rawState(p)).filter(k1 => {
              for (var v of values) {
                let k2 = modelFamly.getKey(v as any)
                if (k2 == k1) {
                  return false;
                }
              }
              return true;
            });
            ksModel.forEach(kModel => {
              reset(modelFamly.state(kModel))
            });
          }
        }
      },
    });
  }
  constructor(
    public modelFamly: ModelFamily<T, R, P1, IFieldsFamily>,
    public option?: CollectionOption

  ) {
    super();
  }
}
export class FieldModelFamily<T, R, P1 extends SerializableParam, P2 extends SerializableParam, IFieldsFamily extends FieldsFamily<P1>>
  extends AbstractFieldStateFamily<T | null, P2, P1 | null> {
  public state!: (p: P2) => RecoilState<T | null>;
  public rawState!: (p: P2) => RecoilState<P1 | null>;
  public build(key: string, nodeField: string[]): void {
    const fmf = this;
    const modelFamly = this.modelFamly;
    if (!fmf.rawState)
      fmf.rawState = recoil.atomFamily<P1 | null, P2>({
        key: [key, '$rawState'].join('-'),
        default: null as any,
      });
    fmf.state = recoil.selectorFamily<T | null, P2>({
      key: [key, '$state'].join('-'),
      get: (p) => ({ get }) => {
        const kModel = get(fmf.rawState(p));
        if (!kModel)
          return null;
        return get(modelFamly.state(kModel))
      },
      set: (p) => ({ set, get, reset }, value) => {
        const kModel = get(fmf.rawState(p));
        if (!kModel)
          return;
        if (value == null || value instanceof DefaultValue) {
          reset(modelFamly.state(kModel))
        } else {
          set(modelFamly.state(kModel), value)
          set(fmf.rawState(p), kModel)
        }
      },
    });
  }
  constructor(
    public modelFamly: ModelFamily<T, R, P1, IFieldsFamily>) {
    super();
  }
}




export const field = {
  modelCollection<T, R, P extends SerializableParam, IFieldsFamily extends FieldsFamily<P>>(
    collection: ModelFamily<T, R, P, IFieldsFamily>,
    option?: CollectionOption
  ) {
    return new FieldModelCollection(collection, option)
  },
  model<T, R, P extends SerializableParam, IFieldsFamily extends FieldsFamily<P>>(
    collection: ModelFamily<T, R, P, IFieldsFamily>
  ) {
    return new FieldModel(collection)
  },
  default<T>(config:
    | RecoilValue<T>
    | Promise<T>
    | T
    | (RecoilValue<T> | Promise<T>)) {
    return new FieldDefault(config)
  },
  defaultSelector<T>(config: ((opts: {
    get: GetRecoilValue;
  }) => Promise<T> | RecoilValue<T> | T)) {
    return new FieldDefaultSelector(config)
  }
}

export const fieldFamily = {
  modelCollection<T, R, P1 extends SerializableParam, P2 extends SerializableParam, IFieldsFamily extends FieldsFamily<P1>>(
    collection: ModelFamily<T, R, P1, IFieldsFamily>,
    option?: CollectionOption
  ) {
    return new FieldModelCollectionFamily<T, R, P1, P2, IFieldsFamily>(collection, option)
  },
  model<T, R, P extends SerializableParam, IFieldsFamily extends FieldsFamily<P>>(
    collection: ModelFamily<T, R, P, IFieldsFamily>
  ) {
    return new FieldModelFamily(collection)
  },
  default<T, P extends SerializableParam>(config:
    | RecoilValue<T>
    | Promise<T>
    | T
    | ((param: P) => T | RecoilValue<T> | Promise<T>)) {
    return new FieldDefaultFamily(config)
  },
  defaultSelector<T, P extends SerializableParam>(config: ((
    param: P,
  ) => (opts: {
    get: GetRecoilValue;
  }) => Promise<T> | RecoilValue<T> | T)) {
    return new FieldDefaultSelectorFamily(config)
  }
}