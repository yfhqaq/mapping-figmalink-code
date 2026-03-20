import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => {
    return {
        container: css`
            height: 45px;
            position: fixed;
            bottom: 0;
            left: var(--spt-menu-width, 0);
            right: 0;
            inset-inline-end: 0;
            z-index: 99;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding-inline: 24px;
            padding-block: 0;
            box-sizing: border-box;
            line-height: 64px;
            background-color: rgba(255, 255, 255);
            border-block-start: 1px solid rgba(5, 5, 5, 0.06);
            color: rgba(0, 0, 0, 0.88);
            transition: all 0.2s ease 0s;
        `,
        content: css`
            display: flex;
            align-items: center;
            justify-content: flex-end;
        `,
        placeholder: css`
            height: 45px;
            width: 100%;
        `,
    };
});
