import { getAppBootData, pathJoin, useMount } from '@spotter/app-client-toolkit';
import React, { FC, ReactNode, useState } from 'react';
import SptPageContainer from '@/components/SptPageContainer';
import { sptI18n } from '@spotter/i18n-sdk';

interface BiEmbeddedProps {
    i18nKey: string;
    id: string;
    topSection?: ReactNode;
    action?: ReactNode;
}
export const BiEmbedded: FC<BiEmbeddedProps> = ({ i18nKey, id, topSection, action }) => {
    const [link, setLink] = useState('');

    useMount(() => {
        fetch(
            new URL(
                //@todo 这里不要这么设计，应该从外部传入进来，因为 biUrl 不是一个全局参数.从外部传入方便在应用范围对该参数进行显式的配置和管理
                pathJoin(getAppBootData()?.biUrl, 'get-url', id?.toString()),
                window.location.origin,
            ).toString(),
        )
            .then((response) => response.text())
            .then((url) => {
                setLink(url);
            })
            .catch((error) => {
                console.error(error);
            });
    });

    return (
        <SptPageContainer action={action} title={sptI18n(i18nKey as any) as string}>
            {topSection}
            <iframe
                title={sptI18n(i18nKey as any) as string}
                className="h-full w-full"
                src={link}
            />
        </SptPageContainer>
    );
};
