import { Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import React, { ComponentProps, FC, ReactNode } from 'react';
import classNames from 'classnames';
import './style/index.less';
import { SptComponentProvider } from '../Provider';

export interface SptHelpTooltipProps
    extends Omit<ComponentProps<typeof Tooltip>, 'title' | 'className'> {
    help: ReactNode | (() => ReactNode);
    className?: string;
}

const HelpTooltipBase: FC<SptHelpTooltipProps> = ({ help, className, ...tooltipProps }) => (
    <Tooltip title={help} arrowPointAtCenter {...tooltipProps}>
        <span className={classNames('help-tooltip-question-icon', className)}>
            <QuestionCircleOutlined />
        </span>
    </Tooltip>
);

/**
 * 带QuestionIcon的Tooltip
 * @param props
 * @returns
 */
const SptHelpTooltip: FC<SptHelpTooltipProps> = (props) => {
    return (
        <SptComponentProvider>
            <HelpTooltipBase {...props} />
        </SptComponentProvider>
    );
};

export default SptHelpTooltip;
