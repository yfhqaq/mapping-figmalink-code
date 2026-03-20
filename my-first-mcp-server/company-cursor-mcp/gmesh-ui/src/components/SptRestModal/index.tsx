import { SearchOutlined } from '@ant-design/icons';
import { ModalForm, ModalFormProps } from '@ant-design/pro-components';
import { Empty, Input } from 'antd';
import React from 'react';
import { CSSProperties, FC, ReactElement, ReactText, useMemo, useState } from 'react';
import { SptComponentProvider } from '../Provider';

export interface SptRestModalProps {
    style?: CSSProperties;
    className?: string;
    title?: string;
    trigger?: ReactElement;
    options?: ReactText[];
    placeholder?: string;
    open?: boolean;
    modalProps?: ModalFormProps;
}

/**
 * 即将废弃，这看起来是一个临时组件
 */
const SptRestModal: FC<SptRestModalProps> = ({
    style,
    title,
    className,
    trigger,
    options,
    placeholder = '请输入',
    open,
    modalProps,
}) => {
    const [search, setSearch] = useState<string>();
    const list = useMemo(() => {
        if (search) {
            return options?.filter((item) => `${item}`?.indexOf(search) > -1);
        }
        return options;
    }, [options, search]);

    return (
        <SptComponentProvider>
            <ModalForm
                style={style}
                title={title}
                width={572}
                open={open}
                className={className}
                trigger={trigger}
                submitter={false}
                {...modalProps}
            >
                <Input
                    prefix={<SearchOutlined />}
                    allowClear
                    value={search}
                    style={{
                        width: 240,
                    }}
                    placeholder={placeholder}
                    onChange={(e) => {
                        setSearch(e.target.value);
                    }}
                />

                <div
                    className="receive-accounts-wrap"
                    style={{
                        background: '#F7F9FB',
                        marginTop: '16px',
                        padding: '16px',
                        height: '324px',
                        overflow: 'auto',
                    }}
                >
                    {list?.map((item, index) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <div key={index} className="mb-8px">
                            {item}
                        </div>
                    ))}
                    {!list || list.length === 0 ? (
                        <div className="h-full flex items-center justify-center">
                            <Empty />
                        </div>
                    ) : null}
                </div>
            </ModalForm>
        </SptComponentProvider>
    );
};

export default SptRestModal;
