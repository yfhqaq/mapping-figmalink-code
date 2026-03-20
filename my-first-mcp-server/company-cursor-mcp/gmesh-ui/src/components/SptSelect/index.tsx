import { PlusOutlined } from '@ant-design/icons';
import { Modal, Select, Tooltip, SelectProps } from 'antd';
import React, { CSSProperties, FC, ReactText, useEffect, useMemo, useState } from 'react';
import SptTransfer from '../SptTransfer';
import { SptComponentProvider } from '../Provider';
import './style/index.less';

export type SptSelectOption = {
    label: string;
    value: string | number;
    [key: string]: any;
};

export interface SptSelectProps {
    style?: CSSProperties;
    className?: string;
    loading?: boolean;
    title?: string;
    options?: SptSelectOption[];
    value?: ReactText[];
    tooltip?: string;
    placeholder?: string;
    request?: () => Promise<SptSelectOption[]>;
    onChange?: (checkedOptions: ReactText[]) => void;
}

/**
 * Spotter Select的封装 (后期打算作为Select组件的统一出口)
 * 带Transfer的下拉选择框,需搭配FormItem或者ProFormItem使用
 * @param param0
 * @returns
 */
const SptSelect: FC<SptSelectProps & SelectProps> = ({
    className,
    options,
    style,
    title,
    value,
    loading,
    tooltip,
    onChange,
    request,
    placeholder = '请选择',
    ...resetProps
}) => {
    const [visible, setVisible] = useState(false);
    const toggleVisible = () => setVisible(!visible);
    const [allOptions, setAllOptions] = useState<SptSelectOption[]>([]);
    const finalOptions = useMemo(() => options ?? allOptions, [options, allOptions]);
    const [checkedValue, setCheckedValue] = useState<ReactText[]>();

    useEffect(() => {
        request &&
            request().then((o) => {
                setAllOptions(o);
            });
    }, [request]);

    useEffect(() => {
        if (visible) {
            // 每次进来初始化列表
            setCheckedValue(value);
        }
    }, [visible]);

    return (
        <SptComponentProvider>
            <div
                className={`spotter-select-container ${className ?? ''}`}
                style={{ ...style }}
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                }}
            >
                <Select
                    style={{ flexGrow: 1 }}
                    showArrow={false}
                    options={finalOptions}
                    loading={loading}
                    value={value}
                    mode="multiple"
                    showSearch
                    maxTagCount="responsive"
                    onChange={onChange}
                    placeholder={placeholder}
                    {...resetProps}
                />
                <Tooltip placement="top" title={tooltip} open={!tooltip ? false : undefined}>
                    <div
                        className="spotter-select-tooltip-suffix suffix"
                        onClick={() => toggleVisible()}
                    >
                        <PlusOutlined />
                    </div>
                </Tooltip>
            </div>
            <Modal
                open={visible}
                width={600}
                bodyStyle={{ height: 500 }}
                title={title}
                onOk={() => {
                    onChange && onChange(checkedValue as string[]);
                    toggleVisible();
                }}
                destroyOnClose
                onCancel={() => {
                    toggleVisible();
                }}
            >
                <SptTransfer
                    defaultValue={value}
                    options={finalOptions}
                    value={checkedValue}
                    onChange={(values) => {
                        setCheckedValue(values);
                    }}
                />
            </Modal>
        </SptComponentProvider>
    );
};

export default SptSelect;
