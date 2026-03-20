import { DatePicker } from 'antd';
import React, { ComponentProps, FC, useMemo } from 'react';
import { nanoid } from 'nanoid';
import { useMount } from '@spotter/app-client-toolkit';
import classNames from 'classnames';
import './index.less';
import { SptComponentProvider } from '../../Provider';

export type SptFilterDatePickerProps = ComponentProps<typeof DatePicker> & {
    label: string;
};

export const SptFilterDatePicker: FC<SptFilterDatePickerProps> = ({
    label,
    className,
    ...restProps
}) => {
    const id = useMemo(
        () =>
            `${label.replace(/[\s"']+/, '-').toLocaleLowerCase()}-${nanoid(6).toLocaleLowerCase()}`,
        [label],
    );
    useMount(() => {
        document
            .querySelector(`.${id} .ant-picker-input`)
            ?.setAttribute('data-spotter-filter-date-picker-inner-label', label);
        document
            .querySelector(`.${id} .ant-picker-input`)
            ?.setAttribute('data-spotter-filter-date-picker-inner-label', label);
    });

    return (
        <SptComponentProvider>
            <DatePicker
                {...restProps}
                className={classNames('spotter-filter-date-picker-with-inner-label', className, id)}
            />
        </SptComponentProvider>
    );
};
