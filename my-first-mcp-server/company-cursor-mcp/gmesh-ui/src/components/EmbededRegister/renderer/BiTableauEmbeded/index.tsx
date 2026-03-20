import React from 'react';
import { useMount } from '@spotter/app-client-toolkit';
import { CSSProperties, FC, useEffect, useRef, useState } from 'react';
import { Dropdown, MenuProps } from 'antd';
import { DatabaseFilled, DownOutlined, DownloadOutlined, TabletFilled } from '@ant-design/icons';
import { Tableau, TableauDialogType } from './tableauTypes';

async function fetchWithTimeout(
    input: RequestInfo,
    init = {} as RequestInit & { timeout?: number },
) {
    const { timeout = 20_000, ...restInit } = init;

    const controller = new AbortController();
    const id = setTimeout(() => {
        controller.abort();
    }, timeout);

    const response = await fetch(input, {
        ...restInit,
        signal: controller.signal,
    });

    clearTimeout(id);

    return response.json();
}

interface TableauRes {
    token: string;
    url: string;
}

interface BiTableauEmbeddedProps {
    name: string;
    url: string;
    style?: CSSProperties;
}

export const BiTableauDashboard: FC<BiTableauEmbeddedProps> = ({ url, style }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [canDownLoadData, setCanDownLoadData] = useState(false);
    const tableauRef = useRef<HTMLDivElement & Tableau>();
    const [tableauInfo, setTableauInfo] = useState<TableauRes>({} as TableauRes);
    async function initTableau() {
        const res = await fetchWithTimeout(`/api/v1/tableau?viewPath=${encodeURIComponent(url)}`, {
            method: 'get',
        });
        setTableauInfo(res);
    }
    useMount(initTableau);

    useEffect(() => {
        const handleMarkselectionChange = () => {
            if (!canDownLoadData) {
                setCanDownLoadData(true);
            }
        };

        const handleInitialized = () => {
            setIsLoaded(true);
        };

        tableauRef.current?.addEventListener('markselectionchanged', handleMarkselectionChange);
        // 监听tableau加载完毕
        tableauRef.current?.addEventListener('firstinteractive', handleInitialized);

        return () => {
            tableauRef.current?.removeEventListener(
                'markselectionchanged',
                handleMarkselectionChange,
            );

            tableauRef.current?.removeEventListener('firstinteractive', handleInitialized);
        };
    }, [tableauInfo]);

    const handleDownload = (type: TableauDialogType) => {
        return tableauRef.current?.displayDialogAsync(type);
    };

    const items: MenuProps['items'] = [
        {
            label: 'Data',
            key: TableauDialogType.ExportData,
            disabled: !canDownLoadData,
            icon: <DatabaseFilled rev={undefined} />,
        },
        {
            label: 'CrossTab',
            key: TableauDialogType.ExportCrossTab,
            icon: <TabletFilled rev={undefined} />,
        },
    ];

    const handleMenuItemClick: MenuProps['onClick'] = ({ key }: { key: string }) => {
        handleDownload(key as TableauDialogType);
    };

    return (
        <div className="h-full w-full">
            {tableauInfo.token ? (
                <div className="relative h-full w-full p-b-40px" style={style}>
                    <tableau-viz
                        src={tableauInfo.url}
                        token={tableauInfo.token}
                        ref={tableauRef}
                        toolbar="hidden"
                        hide-tabs
                    />
                    <div className="absolute bottom-0 left-0 right-0 flex justify-end bg-[#fafafa] p-6px p-r-20px text-[#666666]">
                        {isLoaded && (
                            <Dropdown
                                menu={{ items, onClick: handleMenuItemClick }}
                                trigger={['click']}
                            >
                                <span>
                                    <DownloadOutlined
                                        style={{ fontSize: '24px' }}
                                        rev={undefined}
                                    />
                                    <DownOutlined rev={undefined} />
                                </span>
                            </Dropdown>
                        )}
                    </div>
                </div>
            ) : null}
        </div>
    );
};
