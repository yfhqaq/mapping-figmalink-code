import { Tooltip as AntdTooltip, TooltipProps } from 'antd';
import React, { FC } from 'react';
import classNames from 'classnames';

export type SptTooltipProps = TooltipProps & {
    /** 默认值为 ['hover', 'click'] */
    trigger?: TooltipProps['trigger'];
};

export const getUniqueId = (pathname: string) => {
    return `spt-tooltip-${pathname.replace(/\//g, '-').slice(1)}`;
};

/**
 * 基于antd Tooltip的封装组件
 * @param props
 * @returns
 */
const Tooltip: FC<SptTooltipProps> = (props) => {
    const { overlayClassName, trigger = ['hover', 'click'], ...restProps } = props;

    return (
        <AntdTooltip
            overlayClassName={classNames('spt-tooltip', overlayClassName)}
            trigger={trigger}
            {...restProps}
        />
    );
};

export default Tooltip;
