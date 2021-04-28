import { GetRecoilValue, RecoilValue, SerializableParam } from 'recoil';
import { BaseSchema } from 'yup';
import { Field, FieldFamily } from '../core/field';
declare type FieldYupProps<T> = {
    schemas?: BaseSchema<any, any, any>;
} & ({
    defaultSelector?: undefined;
    default: RecoilValue<T> | Promise<T> | T;
} | {
    default?: undefined;
    defaultSelector: (opts: {
        get: GetRecoilValue;
    }) => Promise<T> | RecoilValue<T> | T;
});
export declare const fieldYup: <T>(props: FieldYupProps<T>) => Field<T>;
declare type FieldFamilyYupProps<T, P> = {
    schemas?: BaseSchema<any, any, any>;
} & ({
    defaultSelector?: undefined;
    default: RecoilValue<T> | Promise<T> | T | ((param: P) => T | RecoilValue<T> | Promise<T>);
} | {
    default: undefined;
    defaultSelector: (param: P) => (opts: {
        get: GetRecoilValue;
    }) => Promise<T> | RecoilValue<T> | T;
});
export declare const fieldFamilyYup: <T, P extends SerializableParam>(props: FieldFamilyYupProps<T, P>) => FieldFamily<T, P>;
export {};
