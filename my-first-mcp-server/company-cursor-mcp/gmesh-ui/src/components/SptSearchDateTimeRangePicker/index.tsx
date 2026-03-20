import { ProFormDateTimeRangePicker, ProFormItemProps } from '@ant-design/pro-components';
import React from 'react';
import { FC, useRef } from 'react';
import { useStyles } from './style';

export interface SptSearchDateTimeRangePickerProps extends ProFormItemProps {
    label?: string | React.ReactNode;
}

export const SptSearchDateTimeRangePicker: FC<SptSearchDateTimeRangePickerProps> = ({
    label,
    fieldProps,
    ...proFormItemProps
}) => {
    const ref = useRef<any>();
    const { styles } = useStyles();

    return (
        <div className={styles.formDate}>
            {label || fieldProps?.label ? (
                <div
                    className={styles.title}
                    onClick={() => {
                        ref.current?.focus();
                    }}
                >
                    {label || fieldProps?.label}
                </div>
            ) : null}
            <ProFormDateTimeRangePicker
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
