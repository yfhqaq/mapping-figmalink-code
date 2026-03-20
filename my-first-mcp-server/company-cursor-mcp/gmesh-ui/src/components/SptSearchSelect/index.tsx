import { ProFormSelect, ProFormSelectProps } from '@ant-design/pro-components';
import classNames from 'classnames';
import React, { useImperativeHandle, useMemo, useRef } from 'react';
import { FC, useState } from 'react';
import { SptComponentProvider } from '../Provider';
import { RefSelectProps } from 'antd';
import useStyle from './style';
import { useTabOnShow } from '@spotter/app-client-toolkit';

export interface SptSearchSelectProps extends Omit<ProFormSelectProps, 'width'> {
    // TODO: label 兼容ReactNode
    label?: React.ReactNode;
}

const baseClassName = 'spt-search-select-with-inner-label';

export const SptSearchSelect: FC<SptSearchSelectProps> = ({
    label,
    className,
    fieldProps,
    ...proFormSelectProps
}) => {
    const { styles } = useStyle();
    const { mode: fieldPropsModel } = fieldProps || {};
    const [searchText, setSearchText] = useState('');
    const mode = proFormSelectProps?.mode || fieldPropsModel;

    const onChangeGuard = (_value: any, _label: any) => {
        fieldProps?.onChange && fieldProps.onChange(_value, _label);
    };

    const onSearchGuard = (value: any) => {
        value !== searchText && setSearchText(value);
        fieldProps?.onSearch && fieldProps.onSearch(value);
    };

    const onBlurGuard = (e: any) => {
        setSearchText(searchText === '' ? '-' : '');
        fieldProps?.onBlur && fieldProps.onBlur(e);
    };

    const onClearGuard = () => {
        setSearchText(searchText === '' ? '-' : '');
        fieldProps?.onClear && fieldProps.onClear();
    };

    const showSearchProperty = useMemo(() => {
        if (fieldProps?.showSearch !== undefined) {
            return {
                showSearch: fieldProps?.showSearch,
            };
        }
        return mode === 'multiple' || mode === 'tags'
            ? {
                  showSearch: true,
              }
            : {};
    }, []);
    const ref = useRef<RefSelectProps>(null);
    const { ref: fieldRef, prefix, ...restFieldProps } = fieldProps || {};

    useImperativeHandle(fieldRef, () => ({
        scrollTo: (args: any) => {
            ref.current?.scrollTo(args);
        },
        focus: () => {
            ref.current?.focus();
        },
        blur: () => {
            ref.current?.blur();
        },
        nativeElement: ref.current?.nativeElement as HTMLElement,
    }));

    useTabOnShow(() => {
        // 临时解决切换标签页的时候，select 的 scroll 位移偏差问题，强制回到首行
        ref.current?.scrollTo({
            top: 0,
        });
    });

    return (
        <SptComponentProvider>
            <ProFormSelect
                noStyle
                fieldProps={{
                    /**
                     * 在 pro 组件中，需要设置 showSearch 为 true，onSearch 回调函数才会执行
                     */
                    ...showSearchProperty,
                    ...restFieldProps,
                    ref: ref,
                    prefix: (
                        <div className={styles.prefixWrapper}>
                            {prefix ? <div className={styles.prefix}>{prefix}</div> : null}
                            <div className={styles.label}>{label}</div>
                        </div>
                    ),
                    className: classNames(
                        baseClassName,
                        styles.select,
                        mode,
                        className,
                        fieldProps?.className,
                    ),
                    onClear: onClearGuard,
                    onSearch: onSearchGuard,
                    onChange: onChangeGuard,
                    onBlur: onBlurGuard,
                }}
                {...proFormSelectProps}
            />
        </SptComponentProvider>
    );
};

export default SptSearchSelect;
