import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => {
    return {
        tableWrap: css`
            .spt-table-search {
                padding-top: 12px;
                padding-bottom: 16px;

                .spt-table-search-cols {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: flex-start;
                    gap: 8px;
                }

                .spt-table-search-actions {
                    margin-bottom: 0;
                }
            }

            .spt-table-pagination-wrap {
                bottom: 0;
                position: sticky;
                z-index: 99;
                background: ${token.colorBgContainer};
                margin: 0;
                padding: 12px 0;
                display: flex;
                align-items: center;
                justify-content: flex-end;

                .spt-table-pagination {
                    .ant-pagination-item {
                        width: 32px;
                        height: 32px;
                    }
                    .ant-pagination-item-active {
                        background: ${token.colorPrimaryBg};
                        border-color: ${token.colorPrimaryBg};
                        color: ${token.colorPrimary};
                    }
                    .ant-pagination-total-text {
                        height: 32px;
                        line-height: 32px;
                    }
                }
            }

            .spt-table-global-divider {
                width: 1px;
                height: 22px;
                background-color: ${token.colorBorderSecondary};
            }
        `,
        tableFitContainer: css`
            display: flex;
            flex-direction: column;
            height: 100%;
        `,
        spotterTable: css`
            .spotter-table-wrapper {
                position: relative;
                height: 100%;
                transition: opacity 0.3s;

                .ant-table-sticky-scroll {
                    display: none;
                }

                .spotter-table-column-resizable-marker {
                    position: absolute;
                    top: 0;
                    left: 0;
                    z-index: 9;
                    display: none;
                    width: 1px;
                    height: 100%;
                    background: ${token.colorPrimary};
                    cursor: col-resize;

                    &::before {
                        position: absolute;
                        top: 0;
                        left: -100vw;
                        z-index: 8;
                        display: block;
                        width: 200vw;
                        height: 100%;
                        background: transparent;
                        cursor: col-resize;
                        content: '';
                        user-select: none;
                    }
                }

                .ant-table-wrapper {
                    .ant-table-thead {
                        > tr > th {
                            height: 47px;
                            line-height: 16px;
                            padding-block: 0;

                            &:not(:last-child):not(.ant-table-selection-column):not(
                                    .ant-table-row-expand-icon-cell
                                ) {
                                &::before {
                                    display: none;
                                }

                                .spotter-table-column-resizable {
                                    position: absolute;
                                    right: -8px;
                                    bottom: 0;
                                    z-index: 1;
                                    width: 16px;
                                    height: 100%;
                                    text-align: center;
                                    cursor: ew-resize;

                                    &::after {
                                        display: inline-block;
                                        width: 0.5px;
                                        height: 50%;
                                        background-color: ${token.colorBorderSecondary};
                                        transform: translate(-50%, 50%);
                                        transition: background-color 0.2s;
                                        content: '';
                                        inset-inline-end: 0;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            .actions-wrapper {
                display: flex;
                align-items: center;
            }
        `,
        spotterTableFitContainer: css`
            &.ant-pro-table:not(.ant-pro-table-extra) {
                display: flex;
                flex-direction: column;
                height: 100%;

                > .ant-pro-card {
                    flex-grow: 1;
                    height: 0;

                    > .ant-pro-card-body {
                        display: flex;
                        flex-direction: column;

                        > .spotter-table-wrapper,
                        > .spotter-table-wrapper .ant-table-wrapper,
                        > .ant-table-wrapper {
                            display: flex;
                            flex-direction: column;
                            flex-grow: 1;
                            height: 0;

                            > .ant-spin-nested-loading {
                                height: 100%;

                                > .ant-spin-container {
                                    display: flex;
                                    flex-direction: column;
                                    height: 100%;

                                    > .ant-table {
                                        flex-grow: 1;
                                        height: 0;
                                        overflow: hidden;

                                        &::after {
                                            display: none;
                                        }

                                        > .ant-table-container {
                                            display: flex;
                                            flex-direction: column;
                                            height: 100%;

                                            > .ant-table-sticky-scroll {
                                                display: none !important;
                                            }

                                            > .ant-table-body {
                                                flex-grow: 1;
                                                height: 0;
                                                overflow: scroll;
                                            }
                                        }
                                    }

                                    > .ant-pagination {
                                        margin-top: 0 !important;
                                    }
                                }
                            }
                        }
                    }
                }

                > .ant-pro-table-search {
                    flex: none;
                    height: auto;
                }
            }
        `,
        spotterTableFitNone: css`
            &.ant-pro-table > .ant-pro-card > .ant-pro-card-body {
                > .spotter-table-wrapper > .ant-table-wrapper,
                > .ant-table-wrapper {
                    > .ant-spin-nested-loading > .ant-spin-container {
                        > .ant-table {
                            > .ant-table-container {
                                > .ant-table-sticky-scroll {
                                    display: none !important;
                                }
                            }

                            > .spotter-table-sticky-scroll-bar {
                                display: none;
                            }
                        }
                    }
                }
            }
        `,
        columnSettingModal: css`
            .spt-table-column-setting-delete-button {
                color: ${token.colorError};
                &.ant-btn-variant-outlined:not(:disabled):not(.ant-btn-disabled):active,
                &.ant-btn-variant-dashed:not(:disabled):not(.ant-btn-disabled):active {
                    color: ${token.colorError};
                }
                &.ant-btn-variant-outlined:not(:disabled):not(.ant-btn-disabled):hover,
                &.ant-btn-variant-dashed:not(:disabled):not(.ant-btn-disabled):hover {
                    color: ${token.colorError};
                }
            }
        `,
    };
});
