import recoil, { RecoilState, RecoilValueReadOnly, SerializableParam } from 'recoil';
import { Field, FieldFamily } from './field';
import { NodeKey } from './nodeKey';
import { ValidateInfo } from './validateInfo';
export declare type FieldsFamily<T, P extends SerializableParam> = {
    [k in keyof T]: T[k] extends any[] ? FieldFamily<T[k], P> : T[k] extends {
        [key: string]: any;
    } ? FieldsFamily<T[k], P> : FieldFamily<T[k], P>;
};
export declare type Fields<T> = {
    [k in keyof T]: T[k] extends any[] ? Field<T[k]> : T[k] extends {
        [key: string]: any;
    } ? Fields<T[k]> : Field<T[k]>;
};
declare type ModelFamilyProps<T, P extends SerializableParam> = {
    fields: FieldsFamily<T, P>;
    key: NodeKey;
};
declare type ModelProps<T> = {
    fields: Fields<T>;
    key: NodeKey;
};
declare type FieldsArray = ({
    item: Field<any> | FieldFamily<any, any>;
    nodeField: string[];
})[];
export declare class ModelFamily<T, P extends SerializableParam> {
    fields: FieldsFamily<T, P>;
    validate: (param: P) => RecoilValueReadOnly<ValidateInfo>;
    value: (param: P) => RecoilState<T>;
    constructor(props: ModelFamilyProps<T, P>);
}
export declare class Model<T> {
    fields: Fields<T>;
    validate: RecoilValueReadOnly<ValidateInfo>;
    value: RecoilState<T>;
    constructor(props: ModelProps<T>);
}
export declare const modelFamily: <T, P extends recoil.SerializableParam>(props: ModelFamilyProps<T, P>) => ModelFamily<T, P>;
export declare const model: <T>(props: ModelProps<T>) => Model<T>;
export declare const buildFields: <M>(props: M) => (key: string, nodeField: string[], fields: Fields<any> | FieldsFamily<any, any> | Field<any> | FieldFamily<any, any>, itens: FieldsArray) => void;
export {};
