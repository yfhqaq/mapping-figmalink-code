export enum FILTER_UPDATE_TYPE {
    ADD = 'add',
    ALL = 'all',
    REMOVE = 'remove',
    REPLACE = 'replace',
}

interface Workbook {
    activeSheet: {
        applyFilterAsync: (
            name: string,
            params: string[],
            type: FILTER_UPDATE_TYPE,
        ) => Promise<void>;
    };
}

export interface Tableau {
    workbook: Workbook;
    exportImageAsync: () => Promise<void>;
    displayDialogAsync: (dialogType: TableauDialogType) => Promise<void>;
}

export const enum TableauDialogType {
    ExportPDF = 'export-pdf',
    ExportData = 'export-data',
    ExportPowerPoint = 'export-powerpoint',
    ExportWorkbook = 'export-workbook',
    ExportCrossTab = 'export-cross-tab',
}
