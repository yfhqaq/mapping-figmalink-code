import { ProFormDateMonthRangePicker, ProFormItemProps } from '@ant-design/pro-components';
import React from 'react';
import { FC, useRef } from 'react';
import './style/index.less';
import classNames from 'classnames';

export interface SptSearchDateMonthPickerProps extends ProFormItemProps {
    label?: string | React.ReactNode;
    className?: string;
}

export const SptSearchDateMonthRangePicker: FC<SptSearchDateMonthPickerProps> = ({
    label,
    className,
    fieldProps,
    ...proFormItemProps
}) => {
    const baseClassName = 'spt-search-month-range-date';
    const ref = useRef<any>();

    return (
        <div className={classNames(baseClassName, className)}>
            {label || fieldProps?.label ? (
                <div
                    className={classNames(`${baseClassName}-title`)}
                    onClick={() => {
                        ref.current?.focus();
                    }}
                >
                    {label || fieldProps?.label}
                </div>
            ) : null}
            <ProFormDateMonthRangePicker
                noStyle
                fieldProps={{
                    ref,
                    bordered: false,
                    ...fieldProps,
                }}
                {...proFormItemProps}
            />
        </div>
    );
};
