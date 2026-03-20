import React, { useMemo } from 'react';
import { Button as AntButton, ConfigProvider, Tooltip } from 'antd';
import type { ButtonProps, TooltipProps } from 'antd';
import classNames from 'classnames';
import { ButtonColorType, ButtonType } from 'antd/es/button';
import { SptComponentProvider } from '../Provider';
import { DEFAULT_BUTTON_THEME, useStyles } from './style';

export type SptButtonColor = 'default' | 'white' | 'danger' | 'success';

export interface SptButtonProps extends Omit<ButtonProps, 'type' | 'color'> {
    type?: ButtonType | 'grey';
    /**
     * 自定义类名
     */
    className?: string;
    /**
     * 是否自动插入空格
     * @default false
     */
    autoInsertSpace?: boolean;
    /**
     * tooltip 提示配置
     */
    tooltip?: TooltipProps | React.ReactNode;
    color?: SptButtonColor | ButtonColorType;
    children?: React.ReactNode;
}

const SptButton: React.FC<SptButtonProps> = ({
    className,
    children,
    type = 'default',
    tooltip,
    color = 'default',
    ...restProps
}) => {
    const { styles } = useStyles();
    const antType = type === 'grey' || type === 'default' ? 'default' : type;

    const theme = useMemo(
        () => (antType === 'default' ? DEFAULT_BUTTON_THEME : undefined),
        [antType],
    );

    const buttonNode = (
        <ConfigProvider theme={theme}>
            <AntButton
                type={antType}
                className={classNames(
                    'spt-button',
                    styles.button,
                    styles[color as keyof typeof styles],
                    className,
                )}
                {...restProps}
            >
                {children}
            </AntButton>
        </ConfigProvider>
    );

    // 优化 1: 将 tooltip 对象的处理提取到组件外部
    const getTooltipProps = (tooltip: TooltipProps | React.ReactNode) =>
        typeof tooltip === 'object' && !React.isValidElement(tooltip)
            ? tooltip
            : { title: tooltip };

    // 优化 2: 直接在渲染时处理，避免不必要的 useMemo
    const tooltipProps = tooltip ? getTooltipProps(tooltip) : null;

    return (
        <SptComponentProvider>
            {tooltip ? (
                <Tooltip {...tooltipProps}>
                    <div>{buttonNode}</div>
                </Tooltip>
            ) : (
                buttonNode
            )}
        </SptComponentProvider>
    );
};

export default SptButton;
