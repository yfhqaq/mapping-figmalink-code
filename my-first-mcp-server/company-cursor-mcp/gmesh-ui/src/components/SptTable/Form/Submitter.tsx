import SptButton, { SptButtonProps } from '@/components/Button';
import { useSptIntl } from '@/lang';
import { UndoOutlined } from '@ant-design/icons';
import { ButtonProps, FormInstance } from 'antd';
import Omit from 'omit.js';
import React, { memo } from 'react';

/** @name 用于配置操作栏 */
export type SearchConfig = {
    /** @name 重置按钮的文本 */
    resetText?: React.ReactNode;
    /** @name 提交按钮的文本 */
    submitText?: React.ReactNode;
};

export interface SubmitterProps<T = Record<string, any>> {
    /** @name 提交方法 */
    onSubmit?: (value?: T) => void;
    /** @name 重置方法 */
    onReset?: (value?: T) => void;
    /** @name 搜索的配置，一般用来配置文本 */
    searchConfig?: SearchConfig;
    /** @name 提交按钮的 props */
    submitButtonProps?: false | (SptButtonProps & { preventDefault?: boolean });
    /** @name 重置按钮的 props */
    resetButtonProps?: false | (ButtonProps & { preventDefault?: boolean });
    /** @name 自定义操作的渲染 */
    render?:
        | ((
              props: SubmitterProps &
                  T & {
                      submit: () => void;
                      reset: () => void;
                  },
              dom: JSX.Element[],
          ) => React.ReactNode[] | React.ReactNode | false)
        | false;
    submit?: () => void;
    reset?: () => void;
    form?: FormInstance;
    target?: HTMLDivElement;
}

const Submitter = (props: SubmitterProps) => {
    const {
        // onSubmit,
        // onReset,
        // form,
        submit,
        reset,
        // render,
        searchConfig = {},
        submitButtonProps,
        resetButtonProps,
    } = props;
    if (props.render === false) {
        return null;
    }

    const intl = useSptIntl();
    // const form = Form.useFormInstance();

    // const submit = () => {
    //     form.submit();
    //     onSubmit?.();
    // };

    // const reset = () => {
    //     form.resetFields();
    //     onReset?.();
    // };

    const {
        submitText = intl.getMessage('tableForm.query', '查询'),
        resetText = intl.getMessage('tableForm.reset', '重置'),
    } = searchConfig;

    const renderDom = [];
    if (submitButtonProps !== false) {
        renderDom.push(
            <SptButton
                key="submit"
                {...Omit(submitButtonProps || {}, ['preventDefault'])}
                type="primary"
                onClick={(e) => {
                    if (!submitButtonProps?.preventDefault) {
                        submit?.();
                    }
                    submitButtonProps?.onClick?.(
                        e as React.MouseEvent<HTMLButtonElement, MouseEvent>,
                    );
                }}
            >
                {submitText}
            </SptButton>,
        );
    }

    if (resetButtonProps !== false) {
        renderDom.push(
            <SptButton
                type="link"
                icon={<UndoOutlined />}
                {...Omit(resetButtonProps || {}, ['preventDefault'])}
                key="reset"
                onClick={(e) => {
                    if (!resetButtonProps?.preventDefault) {
                        reset?.();
                    }
                    resetButtonProps?.onClick?.(
                        e as React.MouseEvent<HTMLButtonElement, MouseEvent>,
                    );
                }}
            >
                {resetText}
            </SptButton>,
        );
    }
    // 避免死循环
    // const renderDom = render ? render({ ...props, form, submit, reset }, dom) : dom;
    // const renderDom = dom;

    if (Array.isArray(renderDom)) {
        if (renderDom?.length < 1) {
            return null;
        }
        if (renderDom?.length === 1) {
            return renderDom[0] as JSX.Element;
        }

        return <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>{renderDom}</div>;
    }

    return renderDom as JSX.Element;
};

Submitter.displayName = 'Submitter';

export default memo(Submitter);
