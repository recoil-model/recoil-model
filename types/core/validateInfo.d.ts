export declare class ValidateInfo {
    message: string | null;
    messages: string[];
    error: boolean;
    constructor(message: string | null, messages: string[], error: boolean);
}
export declare class ValidateInfoModel extends ValidateInfo {
    fields: ValidateInfoFields;
    constructor(message: string | null, messages: string[], error: boolean, fields: ValidateInfoFields);
}
export declare type ValidateInfoFields = {
    [fields: string]: ValidateInfo | ValidateInfoFields;
};
export declare const validateInfo: {
    fields: (...msgs: any) => ValidateInfoModel;
    error: any;
    ok: ValidateInfo;
};
