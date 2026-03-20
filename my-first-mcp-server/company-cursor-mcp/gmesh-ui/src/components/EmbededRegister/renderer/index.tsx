import React from 'react';
import { FC } from 'react';
import { BiEmbedded } from './BiEmbedded';
import { BiTableauDashboard } from './BiTableauEmbeded';

export type NavigationRenderType = 'bi-embedded' | 'default';

export enum BI_DATA_SOURCE_TYPE {
    METABASE = 'metabase',
    TABLEAU = 'tableau',
}

export const EmbeddedRenderer: FC<{
    type: BI_DATA_SOURCE_TYPE;
    data?: any;
}> = ({ type, data }) => {
    switch (type) {
        case BI_DATA_SOURCE_TYPE.METABASE: {
            return <BiEmbedded i18nKey={data?.name} id={data?.biDashboardId} />;
        }
        case BI_DATA_SOURCE_TYPE.TABLEAU: {
            return (
                <BiTableauDashboard
                    name={data?.name}
                    style={data?.biOverrideStyle}
                    url={data?.biTableauUrl}
                />
            );
        }
        default: {
            return null;
        }
    }
};
