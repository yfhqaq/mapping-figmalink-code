import { Select, SelectProps } from 'antd';
import React, { FC } from 'react';
import classNames from 'classnames';
import { SptComponentProvider } from '@/components/Provider';
import useStyles from './style';
export interface SptSelectWithInnerLabelProps extends Omit<SelectProps, 'getPopupContainer'> {
    label: string;
}

export const SptSelectWithInnerLabel: FC<SptSelectWithInnerLabelProps> = ({
    className,
    prefix,
    label,
    ...restProps
}) => {
    const { styles } = useStyles();
    return (
        <SptComponentProvider>
            <Select
                filterOption={
                    restProps.filterOption == false
                        ? false
                        : (inputValue, option) => {
                              if (
                                  restProps.filterOption &&
                                  typeof restProps.filterOption === 'function'
                              ) {
                                  return restProps.filterOption(inputValue, {
                                      ...option,
                                      label: option?.title,
                                  });
                              }
                              return !!(
                                  option?.title
                                      ?.toString()
                                      .toLowerCase()
                                      .includes(inputValue.toLowerCase()) ||
                                  option?.label
                                      ?.toString()
                                      .toLowerCase()
                                      .includes(inputValue.toLowerCase()) ||
                                  option?.value
                                      ?.toString()
                                      .toLowerCase()
                                      .includes(inputValue.toLowerCase())
                              );
                          }
                }
                prefix={
                    <div className={styles.prefixWrapper}>
                        {prefix ? <div className={styles.prefix}>{prefix}</div> : null}
                        <div className={styles.label}>{label}</div>
                    </div>
                }
                {...restProps}
                className={classNames('spt-select-with-inner-label', styles.select, className)}
            />
        </SptComponentProvider>
    );
};
