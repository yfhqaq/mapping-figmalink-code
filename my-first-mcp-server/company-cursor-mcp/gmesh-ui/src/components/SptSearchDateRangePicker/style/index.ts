import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
    formDate: css`
        display: flex;
        align-items: center;
        height: 32px;
        padding-left: 12px;
        border: 1px solid ${token.colorBorder};
        border-radius: ${token.borderRadius}px;

        &:hover {
            border-color: ${token.colorPrimaryHover};
        }
    `,
    title: css`
        display: flex;
        align-items: center;
        height: 100%;
        color: ${token.colorTextTertiary};
        font-weight: 400;
        white-space: nowrap;
    `,
}));
