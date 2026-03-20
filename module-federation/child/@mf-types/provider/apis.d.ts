
    export type RemoteKeys = 'provider';
    type PackageType<T> = T extends 'provider' ? typeof import('provider') :any;