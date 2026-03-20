import { SearchOutlined } from '@ant-design/icons';
import { ProFormItemProps, ProFormText } from '@ant-design/pro-components';
import React, { useRef, useState } from 'react';
import { FC, useMemo } from 'react';
import { SptComponentProvider } from '../Provider';
import { Tooltip } from 'antd';
import './style/index.less';

export interface SptSearchTextProps extends Omit<ProFormItemProps, 'width'> {
    autoSearch?: boolean;
    showTooltip?: boolean;
    onSearch?: () => void;
}

export const SptSearchText: FC<SptSearchTextProps> = ({
    autoSearch = false,
    label,
    fieldProps,
    placeholder,
    ...proFormTextProps
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [showTip, setShowTip] = useState(false);
    const fix = useMemo(
        () => ({
            prefix: autoSearch ? (
                <>
                    <SearchOutlined
                        className="cursor-pointer py-4px"
                        style={{ color: 'var(--color-text-tertiary)' }}
                        rev={undefined}
                    />
                    <div style={{ color: 'var(--color-text-tertiary)', paddingRight: '4px' }}>
                        {fieldProps?.label || label}
                    </div>
                </>
            ) : (
                <div style={{ color: 'var(--color-text-tertiary)', paddingRight: '4px' }}>
                    {fieldProps?.label || label}
                </div>
            ),
        }),
        [autoSearch, fieldProps?.label, label],
    );
    const handleMouseOver = () => {
        const inputElement = ref?.current?.querySelector('input');
        const inputElementWidth = inputElement?.clientWidth;
        const placeholderStr = inputElement?.getAttribute('placeholder');
        const placeholderElement = document.createElement('div');
        placeholderElement.style.position = 'absolute';
        placeholderElement.style.width = `${inputElementWidth}px`;
        placeholderElement.style.visibility = 'hidden';
        placeholderElement.style.whiteSpace = 'nowrap';
        placeholderElement.innerHTML = placeholderStr || '';
        document.body.appendChild(placeholderElement);
        setShowTip(placeholderElement.scrollWidth > placeholderElement.clientWidth);
        document.body.removeChild(placeholderElement);
    };

    return (
        <SptComponentProvider>
            <div ref={ref} onMouseOver={handleMouseOver}>
                <Tooltip
                    overlayClassName="spt-search-text-tooltip"
                    mouseLeaveDelay={0}
                    title={showTip ? fieldProps?.placeholder || placeholder : ''}
                >
                    <ProFormText
                        noStyle
                        fieldProps={{
                            ...fix,
                            ...fieldProps,
                        }}
                        {...proFormTextProps}
                    />
                    <div style={{ display: 'none' }}>{fieldProps?.placeholder || placeholder}</div>
                </Tooltip>
            </div>
        </SptComponentProvider>
    );
};

export default SptSearchText;
