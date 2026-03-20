import { Button, Checkbox, Input, Spin, Tooltip } from 'antd';
import React, { CSSProperties, FC, ReactText, useEffect, useMemo, useState } from 'react';
import classnames from 'classnames';
import { CloseOutlined } from '@ant-design/icons';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import './style/index.less';
import { SptComponentProvider } from '../Provider';

type TransferOption = {
    label: string;
    value: string | number;
    [key: string]: any;
};

export interface SpotterTransferProps {
    style?: CSSProperties;
    className?: string;
    loading?: boolean;
    options?: TransferOption[];
    defaultValue?: ReactText[];
    value?: ReactText[];
    request?: () => Promise<TransferOption[]>;
    searchPlaceholder?: string;
    onChange?: (checkedOptions: ReactText[]) => void;
}

const SptTransfer: FC<SpotterTransferProps> = ({
    className,
    style,
    options,
    defaultValue = [],
    value,
    request,
    searchPlaceholder = '请输入',
    loading = false,
    onChange,
}) => {
    const [checkedList, _setCheckedList] = useState<ReactText[]>(defaultValue);
    const [allOptions, setAllOptions] = useState<TransferOption[]>([]);
    const [searchValue, setSearchValue] = useState('');
    const [_loading, setLoading] = useState(loading);

    // 受控模式和非受控模式在这里基于 single source 的原则进行收束
    const finalOptions = useMemo(() => options ?? allOptions, [options, allOptions]);
    const finalValue = useMemo(() => value ?? checkedList, [value, checkedList]);

    const checkedAll = useMemo(
        () => !!finalOptions.length && finalValue.length === finalOptions.length,
        [finalOptions, finalValue],
    );
    const setCheckedList = (checkedOptions: ReactText[]) => {
        _setCheckedList(checkedOptions);
        onChange && onChange(checkedOptions);
    };

    const onCheckedOptionChange = (e: CheckboxChangeEvent) => {
        const isChecked = !e.target.checked;
        const checkValue = e.target.value;
        if (isChecked) {
            const _index = finalValue.indexOf(checkValue);
            if (_index > -1) {
                const _list = [...finalValue];
                _list.splice(_index, 1);
                setCheckedList(_list);
            }
        } else {
            setCheckedList([...finalValue, checkValue]);
        }
    };

    const filteredOptions = finalOptions.filter(
        (o) => o.label?.toLowerCase().includes(searchValue?.toLowerCase()),
    );
    const checkedOptions = finalOptions.filter((option) => finalValue.includes(option.value));

    useEffect(() => {
        setLoading(loading);
    }, [loading]);

    useEffect(() => {
        (async () => {
            if (request) {
                try {
                    setLoading(true);
                    const o = await request();
                    setAllOptions(o);
                } finally {
                    setLoading(false);
                }
            }
        })();
    }, [request]);

    return (
        <SptComponentProvider>
            <div style={style} className={classnames('spotter-transfer', className)}>
                <Spin spinning={_loading}>
                    <div className="spotter-transfer-loading-container">
                        <div className="spotter-transfer-all-options-container">
                            <Input
                                placeholder={searchPlaceholder}
                                onChange={(e) => {
                                    setSearchValue(e.target.value);
                                }}
                            />
                            <div className="spotter-transfer-all-options-title">
                                <span className="spotter-transfer-all-options-title-summary">{`总共：${finalOptions.length} 项`}</span>
                                <Button
                                    onClick={() => {
                                        setCheckedList(
                                            !checkedAll
                                                ? finalOptions.map(({ value: v }) => v)
                                                : [],
                                        );
                                    }}
                                    type="link"
                                >
                                    {checkedAll ? '取消全选' : '全选'}
                                </Button>
                            </div>
                            <div className="spotter-transfer-all-options-list">
                                {filteredOptions?.map((item) => (
                                    <div
                                        key={item.value}
                                        className="spotter-transfer-all-options-list-item"
                                    >
                                        <Checkbox
                                            value={item.value}
                                            checked={finalValue.includes(item.value)}
                                            onChange={onCheckedOptionChange}
                                        >
                                            {item.label}
                                        </Checkbox>
                                        <br />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="spotter-transfer-checked-options-container">
                            <div className="spotter-transfer-checked-options-title">
                                <span className="spotter-transfer-checked-options-title-summary">{`已选：${finalValue.length} 项`}</span>
                                <Button
                                    onClick={() => {
                                        setCheckedList([]);
                                    }}
                                    type="link"
                                >
                                    清空
                                </Button>
                            </div>
                            <div className="spotter-transfer-checked-options-list">
                                {checkedOptions.map(({ label, value: v }) => (
                                    <div
                                        className="spotter-transfer-checked-options-list-item"
                                        key={label}
                                    >
                                        <span className="spotter-transfer-checked-options-list-item-label">
                                            {label}
                                        </span>
                                        <Tooltip title="移除">
                                            <span
                                                className="spotter-transfer-checked-options-list-item-action remove mr-6px"
                                                onClick={() => {
                                                    setCheckedList(
                                                        checkedList.filter((i) => i !== v),
                                                    );
                                                }}
                                            >
                                                <CloseOutlined />
                                            </span>
                                        </Tooltip>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Spin>
            </div>
        </SptComponentProvider>
    );
};

export default SptTransfer;
