import React from 'react';
import { Modal as AntModal, ConfigProvider } from 'antd';
import type { ModalProps } from 'antd';
import classNames from 'classnames';
import { SptComponentProvider } from '../Provider';
import { useStyles } from './style';

export interface SptModalProps extends ModalProps {
    /**
     * 自定义类名
     */
    className?: string;
    children?: React.ReactNode;
}

const SptModal: React.FC<SptModalProps> = ({ className, children, ...restProps }) => {
    const { styles } = useStyles();

    return (
        <SptComponentProvider>
            <ConfigProvider>
                <AntModal
                    className={classNames(styles.modal, 'spt-modal', className)}
                    {...restProps}
                >
                    {children}
                </AntModal>
            </ConfigProvider>
        </SptComponentProvider>
    );
};

export default SptModal;
