import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
    tabWithBadge: css`
        color: inherit;
        font-size: inherit;
    `,
    tabBadge: css`
        .ant-badge-count {
            background: #ff4a3f;
        }
    `,
}));
