import { ProFormDatePicker, ProFormItemProps } from '@ant-design/pro-components';
import React from 'react';
import { FC, useRef } from 'react';
import { useStyles } from './style';

export interface SptSearchDatePickerProps extends ProFormItemProps {
    label?: string | React.ReactNode;
}

export const SptSearchDatePicker: FC<SptSearchDatePickerProps> = ({
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
            <ProFormDatePicker
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
