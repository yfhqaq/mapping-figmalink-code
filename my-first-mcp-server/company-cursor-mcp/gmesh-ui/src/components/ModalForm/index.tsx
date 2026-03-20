import React from 'react';
import { ModalForm as AntModalForm, ProConfigProvider } from '@ant-design/pro-components';
import type { ModalFormProps } from '@ant-design/pro-components';
import { createStyles } from 'antd-style';
import classNames from 'classnames';
import { SptComponentProvider } from '../Provider';

const useStyles = createStyles(() => ({
    modal: {
        '&.spt-modal': {
            '.ant-modal-content': {
                display: 'flex',
                flexBasis: '100%',
                flexDirection: 'column',
                maxHeight: 'calc(100vh - 48px - 48px)',
                padding: '20px 0',
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

export interface SptModalFormProps<T = Record<string, any>> extends ModalFormProps<T> {
    /**
     * 自定义类名
     */
    className?: string;
    children?: React.ReactNode;
}

const SptModalForm = <T extends Record<string, any>>({
    className,
    children,
    ...restProps
}: SptModalFormProps<T>) => {
    const { styles } = useStyles();

    return (
        <SptComponentProvider>
            <ProConfigProvider>
                <AntModalForm<T>
                    className={classNames(styles.modal, 'spt-modal', className)}
                    {...restProps}
                >
                    {children}
                </AntModalForm>
            </ProConfigProvider>
        </SptComponentProvider>
    );
};

export default SptModalForm;
