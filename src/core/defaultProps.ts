import { GetRecoilValue, RecoilValue, SerializableParam } from "recoil";


export type DefaultSelectorFamilyProps<T, P extends SerializableParam> =
    {
        defaultSelector: (
            param: P,
        ) => (opts: {
            get: GetRecoilValue;
        }) => Promise<T> | RecoilValue<T> | T;
    }

export type DefaultFamilyProps<T, P extends SerializableParam> =
    {
        default:
        | RecoilValue<T>
        | Promise<T>
        | T
        | ((param: P) => T | RecoilValue<T> | Promise<T>);
    }
export type DefaultAndDefaultFamilyProps<T, P extends SerializableParam> = DefaultFamilyProps<T, P> | DefaultSelectorFamilyProps<T, P>




export type DefaultProps<T> = {
    default:
    | RecoilValue<T>
    | Promise<T>
    | T
    | (RecoilValue<T> | Promise<T>);
}


export type DefaultSelectorProps<T> = {
    defaultSelector: (opts: {
        get: GetRecoilValue;
    }) => Promise<T> | RecoilValue<T> | T;
}

export type DefaultAndDefaultProps<T> =
    DefaultSelectorProps<T> | DefaultProps<T>
