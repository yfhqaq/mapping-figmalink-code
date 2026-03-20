import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => {
    const paddingBottom = 16;
    const spotterPageFitContainer = css`
        display: flex;
        flex-direction: column;
        height: 100%;

        > .ant-spin-nested-loading {
            flex-grow: 1;

            > .ant-spin-container {
                height: 100%;
            }
        }
    `;

    return {
        container: css`
            background-color: ${token.colorBgContainer};
            padding: 12px 12px ${paddingBottom}px 12px;
            border-radius: ${token.borderRadiusLG}px;
            box-shadow: 0px 1px 2px 0px rgba(31, 35, 41, 0.04);

            &.fit-container {
                ${spotterPageFitContainer}
            }

            &:has(.spt-table-pagination-wrap) {
                padding-bottom: 0;
            }

            &.tab-navigation-mode {
                .spotter-page-container-title {
                    &-inner {
                        display: flex;
                        align-items: flex-start;
                        margin-bottom: 8px;
                        &-wrap {
                            display: flex;
                            justify-content: center;
                            flex-direction: column;
                            flex: 1 1;
                            flex-grow: 1;
                            height: 100%;
                            width: 0;
                        }
                    }
                    &-main {
                        flex-grow: 1;
                        font-size: 20px;
                        line-height: 28px;
                        min-height: 28px;
                        font-weight: 600;
                        overflow-wrap: break-word;
                    }
                    &-action {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-left: 24px;
                    }
                    &-sub {
                        flex-grow: 1;
                        flex: 1 1;
                        color: ${token.colorTextSecondary};
                        margin-top: 8px;
                    }
                }
            }

            .spotter-page-container-title {
                z-index: 1;
                background: ${token.colorBgContainer};
                &-inner {
                    display: flex;
                    align-items: flex-start;
                    margin-bottom: 8px;
                    &-wrap {
                        display: flex;
                        justify-content: center;
                        flex-direction: column;
                        flex: 1 1;
                        flex-grow: 1;
                        height: 100%;
                        width: 0;
                    }
                }
                &-main {
                    flex-grow: 1;
                    font-size: 20px;
                    line-height: 28px;
                    min-height: 28px;
                    overflow-wrap: break-word;
                }
                &-action {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-left: 24px;
                }
                &-sub {
                    flex-grow: 1;
                    flex: 1 1;
                    color: ${token.colorTextSecondary};
                    margin-top: 8px;
                }
            }

            &-title {
                .ant-tabs-nav {
                    margin-bottom: 12px;
                }
            }

            > .ant-card {
                .ant-card-head {
                    .ant-card-head-title {
                        padding-bottom: 16px;
                    }
                }
            }

            &.with-tabs {
                .ant-card-head-title {
                    padding-top: 16px;

                    .ant-tabs-nav {
                        margin-bottom: 1px;
                    }
                }
            }

            .spotter-table-card-wrapper {
                position: relative;
                display: flex;
                flex-direction: column;
                box-sizing: border-box;
                width: 100%;
                height: 100%;
                margin: 0;
                padding: 0;
                background-color: ${token.colorBgContainer};
                border-radius: 8px;

                > .ant-card-head {
                    padding: 0;
                    border: none;

                    .ant-card-head-wrapper {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        width: 100%;
                        height: 48px;
                        max-height: 48px;
                        padding: 16px 24px;
                        padding-bottom: 0;

                        .ant-card-head-title,
                        .ant-card-extra {
                            padding: 0;
                        }
                    }
                }

                > .ant-card-body {
                    padding: 0;
                }
            }

            &.spotter-page-container-fit-pagination {
                .spt-table-wrap {
                    .spt-table-pagination-wrap {
                        bottom: calc(45px - ${paddingBottom}px);
                    }
                }

                .ant-pro-table {
                    &:last-child {
                        .ant-pro-card {
                            .ant-pro-card-body {
                                .spotter-table-wrapper {
                                    &.with-pagination {
                                        .ant-table:not(.ant-table-empty) {
                                            .spotter-table-sticky-scroll-bar {
                                                bottom: 101px;
                                            }
                                        }
                                    }

                                    .spotter-table-sticky-scroll-bar {
                                        bottom: 45px;
                                    }

                                    .ant-table-pagination {
                                        bottom: 45px !important;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            .spotter-page-container {
                padding: 0; // 覆盖嵌套场景下的内边距
            }

            @media (min-height: 1080px) {
                ${spotterPageFitContainer}

                .ant-tabs.ant-tabs-top {
                    .ant-tabs-content-holder {
                        display: flex;
                        flex-direction: column;

                        .ant-tabs-content {
                            flex-grow: 1;

                            .ant-tabs-tabpane {
                                height: 100%;
                            }
                        }
                    }
                }

                .spotter-table-card-wrapper {
                    > .ant-card-body {
                        flex-grow: 1;
                    }
                }
            }
        `,

        cardHeadTitle: css`
            font-weight: bold;
        `,
        footerPlaceholder: css`
            height: 45px;
            flex-shrink: 0;
        `,
    };
});
