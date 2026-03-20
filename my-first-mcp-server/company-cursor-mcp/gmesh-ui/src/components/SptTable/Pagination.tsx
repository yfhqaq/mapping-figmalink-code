import { Pagination, PaginationProps } from 'antd';
import React, { memo } from 'react';
import { FC } from 'react';
import { useSptIntl } from '@/lang';

export interface SptTablePaginationProps extends PaginationProps {}

const SptPagination: FC<SptTablePaginationProps> = ({
    current,
    total,
    pageSize,
    onChange,
    ...otherProps
}) => {
    const intl = useSptIntl();

    const showTotal: PaginationProps['showTotal'] = (total, range) => {
        return intl.formatWithParams('pagination.showTotal', {
            from: range[0],
            to: range[1],
            total: total,
        });
    };
    // `第 ${range[0]}-${range[1]} 条/总共 ${total} 条`;

    return (
        <div className="spt-table-pagination-wrap">
            <Pagination
                className="spt-table-pagination"
                current={current}
                total={total}
                showTotal={showTotal}
                pageSize={pageSize}
                onChange={onChange}
                {...otherProps}
            />
        </div>
    );
};

export default memo(SptPagination);
