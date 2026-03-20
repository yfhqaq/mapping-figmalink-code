import { Badge, TooltipProps } from 'antd';
import { PresetStatusColorType } from 'antd/es/_util/colors';
import { ReactNode } from 'react';
import Descriptions, { SptDescriptionsProps } from '.';
import SptTitle, { SptTitleProps } from '../SptTitle';
import React from 'react';
import SptTooltipIcon from '../SptTooltipIcon';
import { useStyle } from './styles/proDescriptions';

export interface SptProDescriptionsColumn<T extends Record<string, any>> {
    /** 标题 */
    title?: React.ReactNode;
    /** 数据字段 */
    dataIndex: keyof T;
    /** 自定义渲染 */
    render?: (value: T[keyof T], record: T) => React.ReactNode;
    /** 跨列数 */
    span?: number;
    /** 值的枚举映射 */
    valueEnum?: Record<
        string | number,
        {
            text: ReactNode;
            status?: PresetStatusColorType;
        }
    >;
    /** 值的提示 */
    tooltip?: string | TooltipProps;
}

export interface SptProDescriptionsProps<T extends Record<string, any>>
    extends SptDescriptionsProps {
    /** 列配置 */
    columns?: SptProDescriptionsColumn<T>[];
    /** 数据源 */
    dataSource?: T;
    titleProps?: SptTitleProps;
}

export const ProDescriptions = <T extends Record<string, any>>(
    props: SptProDescriptionsProps<T>,
) => {
    const { styles } = useStyle();
    const { columns, dataSource, title, titleProps, ...restProps } = props;

    const items = React.useMemo(() => {
        if (!columns) return props.items;

        return columns.map((column) => ({
            label: (
                <div className="spt-descriptions-label">
                    <div className="spt-descriptions-label-title">{column.title}</div>
                    {column.tooltip && <SptTooltipIcon tooltip={column.tooltip} />}
                </div>
            ),
            children: column.render
                ? column.render(dataSource?.[column.dataIndex] as any, dataSource ?? ({} as T))
                : column.valueEnum
                  ? (() => {
                        const enumValue =
                            column.valueEnum?.[dataSource?.[column.dataIndex] as string | number];
                        return enumValue ? (
                            enumValue.status ? (
                                <Badge status={enumValue.status} text={enumValue.text} />
                            ) : (
                                enumValue.text
                            )
                        ) : (
                            '-'
                        );
                    })()
                  : dataSource?.[column.dataIndex] ?? '-',
            span: column.span,
        }));
    }, [columns, dataSource, props.items]);

    const titleNode = title ? (
        <SptTitle hasColorBlock {...titleProps}>
            {title}
        </SptTitle>
    ) : null;

    return (
        <Descriptions
            {...restProps}
            title={titleNode}
            items={items}
            className={`spt-pro-descriptions ${styles.proDescriptions} ${props.className ?? ''}`}
        />
    );
};
