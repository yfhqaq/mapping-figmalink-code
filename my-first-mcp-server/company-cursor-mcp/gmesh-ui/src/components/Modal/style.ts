import { createStyles } from 'antd-style';

export const useStyles = createStyles(() => ({
    modal: {
        '&.spt-modal': {
            '.ant-modal-content': {
                display: 'flex',
                flexBasis: '100%',
                flexDirection: 'column',
                maxHeight: 'calc(100vh - 48px - 48px)',
                padding: '20px 0',
                borderRadius: '8px',
            },
            '.ant-modal-header': {
                flexShrink: 0,
                padding: '0 24px',
                '.ant-modal-title': {
                    fontWeight: 600,
                    lineHeight: '24px',
                },
            },
            '.ant-modal-body': {
                position: 'relative',
                flex: '1 1 auto',
                maxHeight: '100%',
                marginRight: '2px',
                padding: '0 24px',
                overflowX: 'hidden',
                overflowY: 'auto',

                '.ant-table-wrapper': {
                    '.ant-pagination': {
                        position: 'sticky',
                        bottom: 0,
                        zIndex: 4,
                    },
                },
            },
            '.ant-modal-footer': {
                padding: '0 24px',
            },
        },
        '.ant-modal-wrap': {
            display: 'flex',
            alignItems: 'center',
            overflow: 'visible',
        },
        '.ant-modal': {
            top: 0,
            display: 'flex',
            flexDirection: 'column',
            maxHeight: 'calc(100vh - 48px - 48px)',
            overflow: 'hidden',
        },
    },
}));
