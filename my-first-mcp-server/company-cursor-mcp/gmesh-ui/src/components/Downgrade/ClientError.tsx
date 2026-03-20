import { FC, useEffect, useState } from 'react';
import { Button, Result } from 'antd';
import React from 'react';
import { domBreakingAutoReporting } from '@spotter/app-client-toolkit';
import './styles/clientError.less';
import { useSptIntl } from '@/lang';

export interface ClientErrorProps {
    error: Error;
}

/**
 * 客户端错误
 * @param param0
 * @returns
 */

export const ClientError: FC<ClientErrorProps> = ({ error }) => {
    const [openDetail, setOpenDetail] = useState<boolean>(false);
    const intl = useSptIntl();
    useEffect(() => {
        domBreakingAutoReporting(error);
    }, []);
    return (
        <div className="client-error-container">
            <div className="client-error-content">
                <Result
                    title={intl.getMessage('infra.downgrade_client_crashed_title') as string}
                    subTitle={
                        openDetail ? (
                            <div>
                                <span className="mr-8px"> {error?.message}</span>
                            </div>
                        ) : (
                            <a
                                onClick={() => {
                                    setOpenDetail(true);
                                }}
                            >
                                {intl.getMessage('common.detail') as string}
                            </a>
                        )
                    }
                    status="500"
                    extra={
                        <Button type="primary" href="/">
                            {intl.getMessage('infra.back_home') as string}
                        </Button>
                    }
                />
            </div>
        </div>
    );
};
