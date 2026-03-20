import { createStyles } from 'antd-style';

export default createStyles(({ css }) => ({
    alert: css`
        display: flex;
        align-items: flex-start;
        .ant-alert-close-icon {
            min-height: 20px;
        }
        .ant-alert-icon {
            min-height: 20px;
        }
    `,
}));
