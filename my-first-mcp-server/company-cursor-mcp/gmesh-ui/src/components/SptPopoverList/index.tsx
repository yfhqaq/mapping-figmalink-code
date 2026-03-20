import React from 'react';
import { DEFAULT_EMPTY_VALUE } from '@spotter/app-client-toolkit';
import { Popover, PopoverProps, Typography } from 'antd';
import { SptComponentProvider } from '../Provider';
import { useStyles } from './style';
import classNames from 'classnames';

export interface SptPopoverListProps extends PopoverProps {
    /**
     * 列表数据
     */
    list?: string[];
    /**
     * 渲染函数，list有多个值的时候，不会对第一个执行
     */
    renderItem?: (arg: string) => React.ReactNode;
    /**
     * 展示统计数量，例如：+68
     */
    showCount?: boolean;
    /**
     * 包裹容器className
     */
    className?: string;
    /**
     * 文字超出是否省略
     */
    ellipsis?: boolean;
}

const PopoverListBase: React.FC<SptPopoverListProps> = ({
    list,
    placement = 'right',
    trigger = 'hover',
    showCount = true,
    renderItem,
    className,
    ellipsis = true,
    children,
    ...props
}) => {
    const { styles } = useStyles();

    const textProps = (tips: string) => ({
        className: styles.text,
        ellipsis: ellipsis
            ? {
                  tooltip: tips,
              }
            : false,
    });

    return (
        <div
            className={classNames('popover-list-container', styles.container, className)}
            id="popover-list-container"
        >
            {list && list?.length > 0 ? (
                list?.length > 1 ? (
                    <div className={styles.text}>
                        {children ? (
                            children
                        ) : (
                            <Typography.Text {...textProps(list[0])}>{list[0]}</Typography.Text>
                        )}
                        <Popover
                            placement={placement}
                            content={list?.map((b: string, index: number) => (
                                <div className={styles.item} key={index}>
                                    {renderItem ? renderItem(b) : b}
                                </div>
                            ))}
                            trigger={trigger}
                            overlayClassName={styles.overlay}
                            {...props}
                        >
                            {showCount ? (
                                <div className={styles.tabNum}>+{(list?.length ?? 0) - 1}</div>
                            ) : null}
                        </Popover>
                    </div>
                ) : children ? (
                    children
                ) : renderItem ? (
                    renderItem(list[0])
                ) : (
                    <Typography.Text {...textProps(list[0])}>{list[0]}</Typography.Text>
                )
            ) : (
                DEFAULT_EMPTY_VALUE
            )}
        </div>
    );
};

/**
 * 额外数据气泡展示
 * @param props
 * @returns
 */
const SptPopoverList: React.FC<SptPopoverListProps> = (props) => {
    return (
        <SptComponentProvider>
            <PopoverListBase {...props} />
        </SptComponentProvider>
    );
};

export default SptPopoverList;
