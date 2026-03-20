import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
    sptSearchTreeSelectWithInnerLabel: css`
        min-width: 200px !important;
        .ant-select-prefix {
            margin-inline-end: 0;
        }
    `,
    prefixWrapper: css`
        display: flex;
        align-items: center;
        color: ${token.colorTextTertiary};
    `,
    prefix: css`
        margin-inline-end: 8px;
    `,
    label: css`
        display: flex;
        align-items: center;
        height: 100%;
        color: ${token.colorTextTertiary};
        font-weight: 400;
        white-space: nowrap;
        margin-inline-end: 8px;
    `,
}));
