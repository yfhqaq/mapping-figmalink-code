export enum AccountType {
    EMAIL = 1,
    PHONE,
}

export enum UserAccountAvailableStatus {
    DISABLE = -1,
    ENABLE = 1,
    PENDING = 2,
}

// 权限分类
export enum PermissionType {
    MENU = 1,
    API = 2,
    DATA = 3,
}

// 菜单分类
export enum MenuType {
    GMESH = 1,
    ROMERX = 2,
}
export const MenuTypeMap = {
    [MenuType.GMESH]: 'gmesh',
    [MenuType.ROMERX]: 'sevc',
};

export enum Actions {
    EDIT = 'edit',
    ADD = 'add',
    DELETE = 'delete',
}

export enum RoleCode {
    accountManager = 'account_manager', // 账号经理
    // 运营经理
    businessManager = 'business_manager_leader',
}

export enum UserStatus {
    FREEZE = -1,
    ACTIVE = 1,
    INACTIVE,
}

// 仓库类型
export enum WAREHOUSE_TYPE {
    Third = 1,
    Cloud = 2,
}

export enum ValidateStorageName {
    PERMIT_DATA = 'PERMIT_DATA',
    PERMIT_TAG_REMOTE = 'permitEtag',
    PERMIT_TAG_LOCAL = 'PERMIT_ETAG_LOCAL',
    MENU_DATA = 'MENU_DATA',
    MENU_TAG_REMOTE = 'menuEtag',
    MENU_TAG_LOCAL = 'MEN_ETAG_LOCAL',
    ROLE_DATA = 'ROLE_DATA',
    ROLE_TAG_REMOTE = 'roleEtag',
    ROLE_TAG_LOCAL = 'ROLE_ETAG_LOCAL',
}
