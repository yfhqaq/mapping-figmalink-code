import React from 'react';
import { Descriptions as AntDescriptions } from 'antd';
import type { DescriptionsProps } from 'antd';
import type { DescriptionsItemProps } from 'antd/es/descriptions/Item';
import { useStyle } from './styles/descriptions';

export interface SptDescriptionsProps extends DescriptionsProps {
    // 扩展的属性可以在这里定义
}

const Descriptions: React.FC<SptDescriptionsProps> = (props) => {
    const { styles } = useStyle();

    return (
        <AntDescriptions
            {...props}
            className={`spt-descriptions ${styles.descriptionItem} ${props.className}`}
        />
    );
};

export interface SptDescriptionsItemProps extends DescriptionsItemProps {
    // 扩展的属性可以在这里定义
}

export const DescriptionsItem = AntDescriptions.Item;

export default Descriptions;
