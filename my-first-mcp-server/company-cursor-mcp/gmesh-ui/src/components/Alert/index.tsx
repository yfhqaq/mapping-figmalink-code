import React from 'react';
import { Alert as AntdAlert, AlertProps as AntdAlertProps } from 'antd';
import { SptComponentProvider } from '@/components/Provider';
import classNames from 'classnames';
import useStyles from './style';

export interface SptAlertProps extends AntdAlertProps {
    /**
     * 自定义类名
     */
    className?: string;
}

/**
 * SptAlert 组件
 *
 * 基于 Ant Design Alert 组件的封装，提供统一的样式和行为
 */
const SptAlert: React.FC<SptAlertProps> = ({ className, ...restProps }) => {
    const { styles } = useStyles();
    return (
        <SptComponentProvider>
            <AntdAlert
                className={classNames('spt-alert', styles.alert, className)}
                {...restProps}
            />
        </SptComponentProvider>
    );
};

export default SptAlert;
