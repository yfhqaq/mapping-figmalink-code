import { createStyles } from 'antd-style';

export default createStyles(({ css }) => ({
    select: css`
        width: 100%;
    `,
    prefixWrapper: css`
        display: flex;
        align-items: center;
    `,
    prefix: css`
        padding: 0 4px;
    `,
    label: css`
        display: flex;
        align-items: center;
        height: 100%;
        color: rgba(0, 0, 0, 0.45);
        font-weight: 400;
        white-space: nowrap;
    `,
}));
