import type { Preview } from "@storybook/tanstack-react";

import "../src/styles.css";

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
