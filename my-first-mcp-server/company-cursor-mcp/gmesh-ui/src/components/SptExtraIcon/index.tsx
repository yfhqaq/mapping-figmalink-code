import { ExclamationCircleFilled } from '@ant-design/icons';
import { IconComponentProps } from '@ant-design/icons/lib/components/Icon';
import React, { FC, useMemo } from 'react';

export interface SptExtraIconProps extends IconComponentProps {
    type?: 'default' | 'info' | 'warning' | 'warn' | 'danger' | 'success';
    icon?: React.ReactNode;
}

/**
 * 面性感叹号图标封装，方便写自定义的提示信息
 * @param param0
 * @returns
 */
const SptExtraIcon: FC<SptExtraIconProps> = ({
    type,
    icon: Icon = <ExclamationCircleFilled />,
    ...props
}) => {
    const color = useMemo(() => {
        switch (type) {
            case 'warning':
            case 'warn':
                return 'var(--color-warning-text)';
            case 'danger':
                return 'var(--color-error-text)';
            case 'success':
                return 'var(--color-success-text)';
            case 'info':
                return 'var(--color-primary)';
            default:
                return 'var(--neutral-color-6)';
        }
    }, [type]);
    const generateIcon = () => {
        return React.cloneElement(Icon as React.ReactElement, {
            style: {
                color,
            },
            ...props,
        });
    };
    return generateIcon();
};

export default SptExtraIcon;
