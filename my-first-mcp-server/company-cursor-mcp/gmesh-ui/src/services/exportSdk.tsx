import { getAppBootData } from '@spotter/app-client-toolkit';
import { SpotterGmeshExportApiSdk } from '@/api';
import { message } from 'antd';
import { sptI18n } from '@spotter/i18n-sdk';

export const gmeshExportSdk = new SpotterGmeshExportApiSdk({
    context: new URL(getAppBootData().appApiUrl),
    res: {
        onAuthError: (error) => {
            console.error(error.data);
        },
        onOtherError: (error) => {
            message.error((sptI18n(error?.data?.msg) as string) ?? error?.data?.msg?.defaultValue);
            console.error(error);
        },
    },
});
