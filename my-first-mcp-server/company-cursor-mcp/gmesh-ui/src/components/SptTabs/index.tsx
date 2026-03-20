import { Badge, BadgeProps, Tabs, TabsProps } from 'antd';
import { FC, ReactNode, useMemo, useState } from 'react';
import SptLabelWithNumber from '../SptLabelWithNumber';
import React from 'react';
import { useStyles } from './style';

export enum SptTabBadgeType {
    // 在一行内进行展示
    Inline,
    // 在右上角进行展示
    Corner,
}

export interface SptTabsProps {
    key: string;
    label: string | ReactNode;
    children?: ReactNode;
    count?: number;
}

export interface SptTabProps extends TabsProps {
    items?: SptTabsProps[];
    badgeType?: SptTabBadgeType;
    badgeProps?: BadgeProps;
}

/**
 * 带Badge的Tab菜单
 */
const SptTabs: FC<SptTabProps> = ({
    items,
    onChange,
    badgeType = SptTabBadgeType.Inline,
    badgeProps = {},
    ...props
}) => {
    const [current, setCurrent] = useState(props.activeKey ?? props.defaultActiveKey);
    const { styles } = useStyles();

    const innerTabs: TabsProps['items'] = useMemo(
        () =>
            items?.map((item) => {
                return {
                    label:
                        badgeType === SptTabBadgeType.Inline ? (
                            <SptLabelWithNumber
                                active={item.key === current}
                                label={item.label}
                                count={item.count ?? 0}
                            />
                        ) : (
                            <Badge
                                count={item.count}
                                offset={[6, -6]}
                                size={props.size === 'small' ? 'small' : 'default'}
                                {...badgeProps}
                                className={`${styles.tabWithBadge} ${badgeProps.className}`}
                                rootClassName={`${styles.tabBadge} ${badgeProps.rootClassName}`}
                            >
                                {item.label}
                            </Badge>
                        ),
                    key: item.key,
                    children: item.children,
                };
            }),
        [items, current, styles],
    );

    return (
        <Tabs
            items={innerTabs}
            onChange={(activeKey) => {
                setCurrent(activeKey);
                onChange?.(activeKey);
            }}
            {...props}
        />
    );
};

export default SptTabs;
