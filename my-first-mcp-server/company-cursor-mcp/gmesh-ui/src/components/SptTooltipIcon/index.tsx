import { QuestionCircleOutlined } from '@ant-design/icons';
import { Tooltip, TooltipProps } from 'antd';
import React, { FC } from 'react';
import { createStyles } from 'antd-style';

const useStyles = createStyles(({ css }) => ({
    tooltipIcon: css`
        display: inline-flex;
        align-items: center;
        cursor: help;
        transition: color 0.3s;

        &:hover {
            color: rgba(0, 0, 0, 0.65);
        }
    `,
    iconWrapper: css`
        margin-left: 4px;
        font-size: 14px;
        vertical-align: middle;
    `,
}));

export interface SptTooltipIconProps extends Omit<TooltipProps, 'title'> {
    /**
     * 提示文本内容
     */
    tooltip?: string | React.ReactNode | TooltipProps;
    /**
     * 自定义图标
     */
    icon?: React.ReactNode;
    /**
     * 图标大小
     */
    size?: number;
    /**
     * 图标颜色
     */
    color?: string;
    /**
     * 点击图标的回调
     */
    onClick?: (e: React.MouseEvent) => void;
}

const SptTooltipIcon: FC<SptTooltipIconProps> = ({
    tooltip,
    icon,
    size = 14,
    color = 'rgba(0, 0, 0, 0.45)',
    onClick,
    placement = 'top',
}) => {
    const { styles } = useStyles();

    // 提取判断逻辑
    const isSimpleTooltip = typeof tooltip === 'string' || React.isValidElement(tooltip);
    const tooltipTitle = isSimpleTooltip ? tooltip : (tooltip as TooltipProps)?.title;
    const tooltipProps = isSimpleTooltip ? {} : (tooltip as TooltipProps);

    return tooltip ? (
        <Tooltip title={tooltipTitle} placement={placement} {...tooltipProps}>
            <span
                className={styles.tooltipIcon}
                style={{
                    fontSize: size,
                    color,
                }}
                onClick={onClick}
            >
                {icon || <QuestionCircleOutlined />}
            </span>
        </Tooltip>
    ) : (
        <span
            className={styles.tooltipIcon}
            style={{
                fontSize: size,
                color,
            }}
            onClick={onClick}
        >
            {icon || <QuestionCircleOutlined />}
        </span>
    );
};

export default SptTooltipIcon;
