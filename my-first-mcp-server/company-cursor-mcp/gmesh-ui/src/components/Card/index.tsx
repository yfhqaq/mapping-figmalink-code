import React from 'react';
import { Card as AntCard } from 'antd';
import type { CardProps } from 'antd';
import classNames from 'classnames';

export interface SptCardProps extends CardProps {
    /**
     * 是否显示边框
     * @default true
     */
    bordered?: boolean;
    /**
     * 头部类名
     */
    headerClassName?: string;
    /**
     * 内容区类名
     */
    bodyClassName?: string;
}

const SptCard: React.FC<SptCardProps> = ({
    className,
    bordered = true,
    headerClassName,
    bodyClassName,
    ...restProps
}) => {
    const { classNames: cardClassNames, ...restCardProps } = restProps;
    return (
        <AntCard
            className={classNames('spt-card', className)}
            classNames={{
                header: classNames('spt-card-head', headerClassName),
                body: classNames('spt-card-body', bodyClassName),
                ...cardClassNames,
            }}
            bordered={bordered}
            {...restCardProps}
        />
    );
};

export default SptCard;
