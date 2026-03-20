import { createStyles } from 'antd-style';

export default createStyles(({ css }) => ({
    drawer: css`
        top: var(--spt-drawer-top, 40px);
        z-index: 100;
        height: calc(100% - var(--spt-drawer-top, 40px));
        border: none;
        outline: none;

        &.ant-drawer-inline {
            position: fixed !important;
        }

        .spotter-table.spotter-table-fit-content.ant-pro-table
            > .ant-pro-card
            > .ant-pro-card-body
            > .spotter-table-wrapper
            > .ant-table-wrapper
            > .ant-spin-nested-loading
            > .ant-spin-container
            > .ant-table
            > .spotter-table-sticky-scroll-bar
            > .spotter-table-sticky-scroll-bar-thumb {
            background: rgba(108, 122, 121, 0.2);
        }

        .ant-drawer-content-wrapper {
            z-index: 99;
            box-shadow:
                -6px 0 16px 0 rgb(0 0 0 / 8%),
                -3px 0 6px -4px rgb(0 0 0 / 12%),
                -9px 0 28px 8px rgb(0 0 0 / 5%);
        }

        .ant-drawer-body {
            padding: 0;
        }

        .ant-drawer-content {
            overflow: visible;
            position: relative;
        }
    `,

    container: css`
        position: relative;
        overflow: visible;

        .ant-drawer-header {
            display: none;
        }
    `,

    closeIcon: css`
        position: absolute;
        top: 20px;
        left: -12px;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        cursor: pointer;

        > .sptfont::after {
            position: absolute;
            top: 1.5px;
            left: 1.5px;
            z-index: -1;
            display: block;
            width: 21px;
            height: 21px;
            background: #fff;
            border-radius: 12px;
            content: '';
        }
    `,

    refWrapper: css`
        height: 100%;
        padding: 16px 8px 8px 24px;
        overflow: visible;

        > .ant-spin-nested-loading {
            height: 100%;

            > .ant-spin-container {
                display: flex;
                flex-direction: column;
                height: 100%;
            }
        }
    `,

    title: css`
        display: flex;
        flex-direction: column;
        padding-right: 16px;
        margin-bottom: 8px;

        &.with-tab-children {
            height: 100%;

            .spotter-drawer-tabs {
                margin-top: 12px;

                .ant-tabs-nav {
                    margin-right: 16px;
                }

                .ant-tabs-content-holder {
                    padding-right: 16px;
                }
            }
        }
    `,

    titleRow: css`
        display: flex;
        align-items: center;
    `,

    titleRowInner: css`
        display: flex;
        flex-direction: column;
        flex: 1 1 0;
        height: 100%;
        justify-content: center;
    `,

    titleRowInnerLeft: css`
        display: flex;
        align-items: center;
    `,

    titleText: css`
        flex-grow: 1;
        font-size: 20px;
        line-height: 28px;
        min-height: 28px;
        font-weight: 600;
        margin-bottom: 0;
    `,

    titleSubText: css`
        flex-grow: 1;
        flex: 1 1 0;
        margin-top: 4px;
        color: rgba(107, 114, 128);
    `,

    titleAction: css`
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 24px;
        flex-wrap: wrap;
    `,

    tabs: css`
        flex-grow: 1;
        height: 0;

        > .ant-tabs {
            height: 100%;

            > .ant-tabs-nav {
                .ant-tabs-tab {
                    .ant-tabs-tab-btn {
                        font-size: 16px;
                    }
                }
            }

            .ant-tabs-content-holder {
                width: 100%;
                overflow-x: hidden;
                overflow-y: auto;
            }
        }
    `,

    content: css`
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        height: 0;
        padding-right: 16px;
        overflow: auto;
        overflow-x: hidden;
    `,
}));
