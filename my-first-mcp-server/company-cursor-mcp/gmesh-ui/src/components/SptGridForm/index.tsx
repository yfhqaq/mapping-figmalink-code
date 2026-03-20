import {
    ProForm,
    ProFormDatePicker,
    ProFormDateTimePicker,
    ProFormDigit,
    ProFormInstance,
    ProFormItemProps,
    ProFormFieldProps,
    ProFormSelect,
    ProFormSelectProps,
    ProFormText,
    ProFormTimePicker,
    ProFormUploadButton,
    ProFormUploadDragger,
} from '@ant-design/pro-components';
import {
    Col,
    ColProps,
    DatePickerProps,
    InputNumberProps,
    InputProps,
    Row,
    RowProps,
    Spin,
} from 'antd';
import React, { createElement, FC, MutableRefObject, ReactNode } from 'react';
import { FieldData } from 'rc-field-form/es/interface';
import classNames from 'classnames';
import { FormLayout } from 'antd/es/form/Form';
import { formatUsAmount } from '@spotter/app-client-toolkit';
import './style/index.less';
import { SptComponentProvider } from '../Provider';

type ProFormAnyItemProps =
    | ProFormSelectProps
    | ProFormFieldProps<InputProps>
    | ProFormFieldProps<InputNumberProps>
    | ProFormItemProps<DatePickerProps>
    | ProFormFieldProps<DatePickerProps>;

export type SptGridFormItem = {
    label: ReactNode;
    name: string;
    render?: (val: any) => ReactNode;
    type?: 'string' | 'number' | 'enum' | 'date' | 'time' | 'date-time' | 'file-dragger' | 'file';
} & ProFormAnyItemProps;

export interface SptGridFormProps {
    loading?: boolean;
    fields?: FieldData[];
    formRef?: MutableRefObject<ProFormInstance>;
    col: number;
    formItems: SptGridFormItem[];
    layout?: FormLayout;
    labelCol?: ColProps;
    rowJustify?: RowProps['justify'];
}

const getFormItemComponent = (type: SptGridFormItem['type']) => {
    switch (type) {
        case 'number': {
            return ProFormDigit;
        }
        case 'enum': {
            return ProFormSelect;
        }
        case 'date': {
            return ProFormDatePicker;
        }
        case 'time': {
            return ProFormTimePicker;
        }
        case 'date-time': {
            return ProFormDateTimePicker;
        }
        case 'file-dragger': {
            return ProFormUploadDragger;
        }
        case 'file': {
            return ProFormUploadButton;
        }
        default: {
            return ProFormText;
        }
    }
};

const SptGridForm: FC<SptGridFormProps> = ({
    fields,
    formRef,
    col,
    formItems,
    layout = 'vertical',
    labelCol,
    loading = false,
    rowJustify = 'start',
}) => {
    // 分类型且没有render进行注入render，不影响其他type的类型转换
    for (const b of formItems) {
        if (b.type === 'number' && b.readonly && !b?.render) {
            b.render = (val: string) => <>{formatUsAmount(val)}</>;
        }
    }
    return (
        <SptComponentProvider>
            <Spin spinning={loading}>
                <ProForm
                    className="spotter-grid-form"
                    fields={fields}
                    submitter={{
                        render: false,
                    }}
                    layout={layout}
                    formRef={formRef}
                    labelCol={labelCol}
                >
                    {formItems
                        .reduce((p, c, i) => {
                            if (i % col === 0) {
                                p.push([c]);
                            } else {
                                p[p.length - 1].push(c);
                            }
                            return p;
                        }, [] as SptGridFormItem[][])
                        .map((cols, index) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <Row key={index} gutter={[36, 0]} justify={rowJustify}>
                                {cols.map((item) => (
                                    <Col
                                        {...item.colProps}
                                        key={item.name}
                                        span={item.colProps?.span ?? 24 / col}
                                    >
                                        {createElement(
                                            getFormItemComponent(item.type) as any,
                                            {
                                                ...item,
                                                filedConfig: {
                                                    ...item.filedConfig,
                                                    className: classNames(
                                                        item.filedConfig?.className ?? '',
                                                        {
                                                            'spotter-form-item-readonly':
                                                                item.readonly,
                                                        },
                                                    ),
                                                },
                                                key: item.name,
                                                name: item.name,
                                                label: (
                                                    <span className="spotter-form-item-label">
                                                        {item.label}
                                                    </span>
                                                ),
                                            } as any,
                                        )}
                                    </Col>
                                ))}
                            </Row>
                        ))}
                </ProForm>
            </Spin>
        </SptComponentProvider>
    );
};

export default SptGridForm;
