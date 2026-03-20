declare const getStorybookMetadata: () => {
    configDir: string;
    workingDir: string;
    storiesPaths: string;
    normalizedStoriesEntries: {
        importPathMatcher: RegExp;
        titlePrefix: string;
        directory: string;
        files: string;
    }[];
    lazyCompilation: boolean;
};

export { getStorybookMetadata };
