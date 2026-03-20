export const badgeProps = {
    /** Number to show in badge */
    count: 'React.ReactNode',
    showZero: 'boolean',
    /** Max count to show */
    overflowCount: 'number',
    /** Whether to show red dot without number */
    dot: 'boolean',
    style: 'React.CSSProperties',
    prefixCls: 'string',
    scrollNumberPrefixCls: 'string',
    className: 'string',
    rootClassName: 'string',
    status: ["success", "processing", "error", "default", "warning"],
    color: 'color',
    text: 'React.ReactNode',
    size: ['default', 'small'],
    offset: ['number | string', ' number | string'],
    title: 'string',
    children: 'React.ReactNode',
}
export const buttonProps = {
    type: ["default", "primary", "ghost", "dashed", "link", "text"],
    icon: 'React.ReactNode',
    shape: ["default", "circle", "round"],
    size: ['small', 'middle', 'large'],
    disabled: 'boolean',
    loading: 'boolean',
    prefixCls: 'string',
    className: 'string',
    rootClassName: 'string',
    ghost: 'boolean',
    danger: 'boolean',
    block: 'boolean',
    children: 'React.ReactNode',
}

function mapTypeToFormat(type: any) {
    if (Array.isArray(type)) {
        return 'select'
    }
    switch (type) {
        case 'React.ReactNode':
        case 'string':
        case 'LiteralUnion<PresetColorKey>':
        case 'PresetStatusColorType':
        case 'React.CSSProperties':
            return 'editInput';
        case 'boolean':
            return 'checkbox';
        case 'number':
            return 'numberInput';
        default:
            return 'editInput'; // 默认格式
    }
}
export enum RenderComponentConfig {
    Button = 'Button',
    Container = 'Container',
    TabWithBadge = 'TabWithBadge',
    SptTable = 'SptTable'
}
export const jsonMap = {
    [RenderComponentConfig.Button]: buttonProps,
    [RenderComponentConfig.Container]: buttonProps,
    [RenderComponentConfig.TabWithBadge]: badgeProps,
    [RenderComponentConfig.SptTable]: buttonProps,
}
enum formatProps {
    editInput = 'editInput',
    numberInput = 'numberInput',
    select = 'select',
    checkbox = 'checkbox',
}
interface attrProps {
    format: formatProps,
    formalParams: string,
    initValue: any,
    name: string,
    enumvalue?: any[]
}
export function generatePropsJson(props: any) {
    const result: any = {};
    for (const [key, value] of Object.entries(props)) {
        const params: attrProps = {
            format: mapTypeToFormat(value) as any,
            formalParams: "",
            initValue: '',
            name: key,
        };
        if (Array.isArray(value)) {
            params['enumvalue'] = value
        }
        result[key] = params
    }
    return result;
}

