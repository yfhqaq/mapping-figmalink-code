import { createStyles } from 'antd-style';

export const useStyle = createStyles(({ css }) => {
    return {
        proDescriptions: css`
            .spt-descriptions-label {
                display: flex;
                align-items: center;
                gap: 4px;
            }
        `,
    };
});
