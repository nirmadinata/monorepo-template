import type { Preview } from "@storybook/tanstack-react";

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(?<color>background|color)$/iu,
                date: /Date$/iu,
            },
        },
    },
};

export default preview;
