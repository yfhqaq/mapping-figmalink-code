import { ProFormCascader, ProFormItemProps } from '@ant-design/pro-components';
import React, { useState } from 'react';
import { FC } from 'react';
import { SptComponentProvider } from '../Provider';
import { CascaderProps } from 'antd';
import classNames from 'classnames';
import useStyle from './style';

type ProFormCascaderProps = ProFormItemProps<CascaderProps<any>>;

export interface SptSearchCascaderProps extends Omit<ProFormCascaderProps, 'width'> {
    label?: React.ReactNode;
}

const baseClassName = 'spt-search-cascader-with-inner-label';

const SptSearchCascader: FC<SptSearchCascaderProps> = ({
    label,
    className,
    fieldProps,
    ...proFormSelectProps
}) => {
    const { styles } = useStyle();
    const [searchText, setSearchText] = useState('');

    const onChangeGuard = (_value: any, _label: any) => {
        fieldProps?.onChange && fieldProps.onChange(_value, _label);
    };

    const onSearchGuard = (value: any) => {
        value !== searchText && setSearchText(value);
        fieldProps?.onSearch && fieldProps.onSearch(value);
    };
    const onBlurGuard = (e?: any) => {
        setSearchText(searchText === '' ? '-' : '');
        fieldProps?.onBlur && fieldProps.onBlur(e);
    };
    const { prefix, ...restFieldProps } = fieldProps ?? {};

    return (
        <SptComponentProvider>
            <ProFormCascader
                noStyle
                colon={false}
                label={label}
                fieldProps={{
                    ...restFieldProps,
                    prefix: (
                        <div className={styles.prefixWrapper}>
                            <div className={styles.label}>{label}</div>
                            {prefix ? <div className={styles.prefix}>{prefix}</div> : null}
                        </div>
                    ),
                    className: classNames(
                        baseClassName,
                        styles.select,
                        className,
                        fieldProps?.multiple ? 'multiple' : '',
                    ),
                    onChange: onChangeGuard,
                    onSearch: onSearchGuard,
                    onBlur: onBlurGuard,
                }}
                {...proFormSelectProps}
            />
        </SptComponentProvider>
    );
};

export default SptSearchCascader;
