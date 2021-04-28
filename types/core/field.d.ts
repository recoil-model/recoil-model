import { ValidateInfo } from "./validateInfo";
import { GetRecoilValue, RecoilState, RecoilValue, RecoilValueReadOnly, SerializableParam } from 'recoil';
export declare class FieldFamily<T, P extends SerializableParam> {
    private FnBuild;
    validate: (param: P) => RecoilValueReadOnly<ValidateInfo>;
    value: (param: P) => RecoilState<T>;
    build(key: string, nodeField: string[]): void;
    constructor(FnBuild: {
        (key: string, nodeField: string[]): {
            validate: (param: P) => RecoilValueReadOnly<ValidateInfo>;
            value: (param: P) => RecoilState<T>;
        };
    });
}
export declare class Field<T> {
    private FnBuild;
    validate: RecoilValueReadOnly<ValidateInfo>;
    value: RecoilState<T>;
    build(key: string, nodeField: string[]): void;
    constructor(FnBuild: {
        (key: string, nodeField: string[]): {
            validate: RecoilValueReadOnly<ValidateInfo>;
            value: RecoilState<T>;
        };
    });
}
declare type FieldProps<T> = {
    validate: (opts: {
        get: GetRecoilValue;
    }) => Promise<ValidateInfo> | RecoilValue<ValidateInfo> | ValidateInfo;
} & ({
    defaultSelector?: undefined;
    default: RecoilValue<T> | Promise<T> | T;
} | {
    default?: undefined;
    defaultSelector: (opts: {
        get: GetRecoilValue;
    }) => Promise<T> | RecoilValue<T> | T;
});
export declare const field: <T>(props: FieldProps<T>) => Field<T>;
declare type FieldFamilyProps<T, P extends SerializableParam> = {
    validate?: (param: P) => (opts: {
        get: GetRecoilValue;
    }) => Promise<ValidateInfo> | RecoilValue<ValidateInfo> | ValidateInfo;
} & ({
    defaultSelector: undefined;
    default: RecoilValue<T> | Promise<T> | T | ((param: P) => T | RecoilValue<T> | Promise<T>);
} | {
    default: undefined;
    defaultSelector: (param: P) => (opts: {
        get: GetRecoilValue;
    }) => Promise<T> | RecoilValue<T> | T;
});
export declare const fieldFamily: <T, P extends SerializableParam>(props: FieldFamilyProps<T, P>) => FieldFamily<T, P>;
export {};
