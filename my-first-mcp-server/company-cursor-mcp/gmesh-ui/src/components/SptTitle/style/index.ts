import { createStyles } from 'antd-style';

export const useStyles = createStyles(() => ({
    container: {
        '.spotter-title-container': {
            display: 'flex',
            alignItems: 'center',
            lineHeight: '24px',

            '&.spotter-title-size-bigger': {
                fontSize: '20px',
                '.sptter-title-before-color-block': {
                    height: '20px',
                },
            },
            '&.spotter-title-size-medium': {
                fontSize: '16px',
                '.sptter-title-before-color-block': {
                    height: '16px',
                },
            },
            '&.spotter-title-size-small': {
                fontSize: '14px',
                '.sptter-title-before-color-block': {
                    height: '14px',
                },
            },

            '&.spotter-title-weight-normal': {
                fontWeight: 400,
            },
            '&.spotter-title-weight-bold': {
                fontWeight: 600,
            },

            '.sptter-title-before-color-block': {
                display: 'block',
                width: '3px',
                marginRight: '8px',
                borderRadius: '4px',
                backgroundColor: 'var(--primary-color-6)',
            },
        },

        '.spotter-title-description': {
            display: 'inline-block',
            marginTop: '8px',
            color: 'rgba(0, 0, 0, 0.45)',
            fontWeight: 400,
            paddingBottom: '4px',
        },
    },
}));
