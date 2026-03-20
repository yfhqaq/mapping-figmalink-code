declare const _default: {
    readonly definitions: {
        readonly Provides: {
            readonly description: "Modules that should be provided as shared modules to the share scope. When provided, property name is used to match modules, otherwise this is automatically inferred from share key.";
            readonly anyOf: readonly [{
                readonly type: "array";
                readonly items: {
                    readonly description: "Modules that should be provided as shared modules to the share scope.";
                    readonly anyOf: readonly [{
                        readonly $ref: "#/definitions/ProvidesItem";
                    }, {
                        readonly $ref: "#/definitions/ProvidesObject";
                    }];
                };
            }, {
                readonly $ref: "#/definitions/ProvidesObject";
            }];
        };
        readonly ProvidesConfig: {
            readonly description: "Advanced configuration for modules that should be provided as shared modules to the share scope.";
            readonly type: "object";
            readonly additionalProperties: false;
            readonly properties: {
                readonly eager: {
                    readonly description: "Include the provided module directly instead behind an async request. This allows to use this shared module in initial load too. All possible shared modules need to be eager too.";
                    readonly type: "boolean";
                };
                readonly shareKey: {
                    readonly description: "Key in the share scope under which the shared modules should be stored.";
                    readonly type: "string";
                    readonly minLength: 1;
                };
                readonly request: {
                    readonly description: "Import request to match on";
                    readonly type: "string";
                    readonly minLength: 1;
                };
                readonly shareScope: {
                    readonly description: "Share scope name.";
                    readonly anyOf: readonly [{
                        readonly type: "string";
                        readonly minLength: 1;
                    }, {
                        readonly type: "array";
                        readonly items: {
                            readonly type: "string";
                            readonly minLength: 1;
                        };
                    }];
                };
                readonly requiredVersion: {
                    readonly description: "Version requirement from module in share scope.";
                    readonly anyOf: readonly [{
                        readonly description: "No version requirement check.";
                        readonly enum: readonly [false];
                    }, {
                        readonly description: "Version as string. Can be prefixed with '^' or '~' for minimum matches. Each part of the version should be separated by a dot '.'.";
                        readonly type: "string";
                    }];
                };
                readonly strictVersion: {
                    readonly description: "Do not accept shared module if version is not valid (defaults to yes, if local fallback module is available and shared module is not a singleton, otherwise no, has no effect if there is no required version specified).";
                    readonly type: "boolean";
                };
                readonly singleton: {
                    readonly description: "Allow only a single version of the shared module in share scope (disabled by default).";
                    readonly type: "boolean";
                };
                readonly layer: {
                    readonly description: "Layer in which the shared module should be placed.";
                    readonly type: "string";
                    readonly minLength: 1;
                };
                readonly issuerLayer: {
                    readonly description: "Layer of the issuer.";
                    readonly type: "string";
                    readonly minLength: 1;
                };
                readonly version: {
                    readonly description: "Version of the provided module. Will replace lower matching versions, but not higher.";
                    readonly anyOf: readonly [{
                        readonly description: "Don't provide a version.";
                        readonly enum: readonly [false];
                    }, {
                        readonly description: "Version as string. Each part of the version should be separated by a dot '.'.";
                        readonly type: "string";
                    }];
                };
            };
        };
        readonly ProvidesItem: {
            readonly description: "Request to a module that should be provided as shared module to the share scope (will be resolved when relative).";
            readonly type: "string";
            readonly minLength: 1;
        };
        readonly ProvidesObject: {
            readonly description: "Modules that should be provided as shared modules to the share scope. Property names are used as share keys.";
            readonly type: "object";
            readonly additionalProperties: {
                readonly description: "Modules that should be provided as shared modules to the share scope.";
                readonly anyOf: readonly [{
                    readonly $ref: "#/definitions/ProvidesConfig";
                }, {
                    readonly $ref: "#/definitions/ProvidesItem";
                }];
            };
        };
    };
    readonly title: "ProvideSharedPluginOptions";
    readonly type: "object";
    readonly additionalProperties: false;
    readonly properties: {
        readonly provides: {
            readonly $ref: "#/definitions/Provides";
        };
        readonly shareScope: {
            readonly description: "Share scope name used for all provided modules (defaults to 'default').";
            readonly anyOf: readonly [{
                readonly type: "string";
                readonly minLength: 1;
            }, {
                readonly type: "array";
                readonly items: {
                    readonly type: "string";
                    readonly minLength: 1;
                };
            }];
        };
    };
    readonly required: readonly ["provides"];
};
export default _default;
