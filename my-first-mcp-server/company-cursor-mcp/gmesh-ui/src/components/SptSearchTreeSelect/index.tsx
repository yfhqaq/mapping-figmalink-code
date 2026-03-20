import { ProFormItemProps, ProFormTreeSelect } from '@ant-design/pro-components';
import classNames from 'classnames';
import React from 'react';
import { FC } from 'react';
import { useStyles } from './style';
import { SptComponentProvider } from '../Provider';

type ProFormTreeSelectProps = React.ComponentProps<typeof ProFormTreeSelect>;

export interface SptSearchTreeSelectProps extends ProFormTreeSelectProps {}

export const SptSearchTreeSelect: FC<SptSearchTreeSelectProps & ProFormItemProps> = ({
    label,
    className,
    fieldProps,
    ...proFormSelectProps
}) => {
    const { prefix, ...restFieldProps } = fieldProps || {};
    const { styles } = useStyles();

    const onChangeGuard = (_value: any, _label: any, _extra: any) => {
        fieldProps?.onChange && fieldProps.onChange(_value, _label, _extra);
    };

    const onSearchGuard = (_value: any) => {
        fieldProps?.onSearch && fieldProps.onSearch(_value);
    };

    return (
        <SptComponentProvider>
            <ProFormTreeSelect
                fieldProps={{
                    ...restFieldProps,
                    onChange: onChangeGuard,
                    onSearch: onSearchGuard,
                    className: classNames(
                        styles.sptSearchTreeSelectWithInnerLabel,
                        className,
                        fieldProps?.showSearch && !fieldProps?.multiple ? 'show-search' : '',
                        fieldProps?.multiple || fieldProps?.treeCheckable ? 'multiple' : '',
                    ),
                    prefix: (
                        <div className={styles.prefixWrapper}>
                            {prefix ? <div className={styles.prefix}>{prefix}</div> : null}
                            <div className={styles.label}>{label}</div>
                        </div>
                    ),
                }}
                {...proFormSelectProps}
            />
        </SptComponentProvider>
    );
};
