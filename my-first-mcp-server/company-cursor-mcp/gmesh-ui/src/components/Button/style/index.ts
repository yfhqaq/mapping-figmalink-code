import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ token }) => ({
    button: {},
    white: {
        backgroundColor: '#FFFFFF',
        color: 'rgba(28,31,35,0.8)',
        borderColor: 'transparent',
        boxShadow: '0 1px 2px rgba(31, 35, 41, 0.04)',
        '&:hover': {
            backgroundColor: '#F1F2F2',
            color: 'rgba(28,31,35,0.8)',
        },
        '&:active': {
            backgroundColor: '#E8E9E9',
            color: 'rgba(28,31,35,0.8)',
        },
        '&[disabled]': {
            backgroundColor: 'rgba(46, 48, 56, 0.04)',
            color: 'rgba(28, 31, 35, 0.35)',
            borderColor: 'transparent',
            '&:hover': {
                backgroundColor: 'rgba(46, 48, 56, 0.04)',
                color: 'rgba(28, 31, 35, 0.35)',
                borderColor: 'transparent',
            },
        },
        '&.ant-btn.ant-btn-loading': {
            color: 'rgba(28, 31, 35, 0.35)',
            backgroundColor: 'rgba(46, 48, 56, 0.04)',
        },
    },
    danger: {
        background: '#FFFFFF',
        color: '#FF150F',
        borderColor: 'transparent',
        boxShadow: '0 1px 2px rgba(31, 35, 41, 0.04)',
        '&.ant-btn-variant-outlined:not(:disabled):not(.ant-btn-disabled):hover, &.ant-btn-variant-dashed:not(:disabled):not(.ant-btn-disabled):hover':
            {
                backgroundColor: '#F1F2F2',
                color: '#FF150F',
                borderColor: 'transparent',
            },
        '&:hover': {
            backgroundColor: '#F1F2F2',
            color: '#FF150F',
        },
        '&.ant-btn-variant-outlined:not(:disabled):not(.ant-btn-disabled):active, &.ant-btn-variant-dashed:not(:disabled):not(.ant-btn-disabled):active':
            {
                backgroundColor: '#E8E9E9',
                color: '#FF150F',
                borderColor: 'transparent',
            },
        '&:active': {
            backgroundColor: '#E8E9E9',
            color: token.colorError,
        },
        '&[disabled]': {
            backgroundColor: 'rgba(46, 48, 56, 0.04)',
            color: 'rgba(28, 31, 35, 0.35)',
            borderColor: 'transparent',
            '&:hover': {
                backgroundColor: 'rgba(46, 48, 56, 0.04)',
                color: 'rgba(28, 31, 35, 0.35)',
                borderColor: 'transparent',
            },
        },
        '&.ant-btn.ant-btn-loading': {
            color: 'rgba(28, 31, 35, 0.35)',
            backgroundColor: 'rgba(46, 48, 56, 0.04)',
        },
    },
    success: {
        background: '#FFFFFF',
        color: '#3CCC38',
        borderColor: 'transparent',
        boxShadow: '0 1px 2px rgba(31, 35, 41, 0.04)',
        '&.ant-btn-variant-outlined:not(:disabled):not(.ant-btn-disabled):hover, &.ant-btn-variant-dashed:not(:disabled):not(.ant-btn-disabled):hover':
            {
                backgroundColor: '#F1F2F2',
                color: '#3CCC38',
                borderColor: 'transparent',
            },
        '&:hover': {
            backgroundColor: '#F1F2F2',
            color: '#3CCC38',
        },
        '&.ant-btn-variant-outlined:not(:disabled):not(.ant-btn-disabled):active, &.ant-btn-variant-dashed:not(:disabled):not(.ant-btn-disabled):active':
            {
                backgroundColor: '#E8E9E9',
                color: '#3CCC38',
                borderColor: 'transparent',
            },
        '&:active': {
            backgroundColor: '#E8E9E9',
            color: '#3CCC38',
        },
        '&.ant-btn.ant-btn-loading': {
            color: 'rgba(28, 31, 35, 0.35)',
            backgroundColor: 'rgba(46, 48, 56, 0.04)',
        },
        '&[disabled]': {
            backgroundColor: 'rgba(46, 48, 56, 0.04)',
            color: 'rgba(28, 31, 35, 0.35)',
            borderColor: 'transparent',
            '&:hover': {
                backgroundColor: 'rgba(46, 48, 56, 0.04)',
                color: 'rgba(28, 31, 35, 0.35)',
                borderColor: 'transparent',
            },
        },
    },
}));

// 将默认主题配置抽离为常量
export const DEFAULT_BUTTON_THEME = {
    components: {
        Button: {
            defaultBorderColor: 'rgb(244,245,245)',
            defaultHoverBg: 'rgb(236,237,237)',
            defaultHoverColor: 'rgba(0,0,0,0.88)',
            defaultHoverBorderColor: 'rgb(244,245,245)',
            defaultActiveBg: 'rgb(223,224,224)',
            defaultActiveBorderColor: 'rgb(223,224,224)',
            defaultActiveColor: 'rgba(0,0,0,0.88)',
            defaultBg: 'rgb(244,245,245)',
            borderColorDisabled: 'rgba(46,48,56,0.04)',
            colorTextDisabled: 'rgba(28,31,35,0.34)',
        },
    },
};
