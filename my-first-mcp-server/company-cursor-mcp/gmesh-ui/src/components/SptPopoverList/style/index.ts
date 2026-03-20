import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
    container: css`
        display: inline-block;
        width: 100%;
    `,
    text: css`
        display: flex;
        align-items: center;
        line-height: 22px;
    `,
    item: css`
        font-size: 14px;
        line-height: 22px;
    `,
    tabNum: css`
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-left: 4px;
        padding: 0 8px;
        color: rgb(0 0 0 / 45%);
        font-size: 12px;
        background: #f0f5ff;
        border-radius: 30px;
        vertical-align: middle;
    `,
    overlay: css`
        .ant-popover-inner {
            padding: 12px 2px;
            .ant-popover-inner-content {
                padding: 0 10px;
                max-height: 218px;
                overflow: auto;
            }
        }
    `,
}));
