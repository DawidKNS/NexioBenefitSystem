import { defineConfig, devices } from "@playwright/test";
import { testConfig } from "./config/testConfig";
import { testConfigLocal } from "./config/testConfig_local";
import { LoadConfig } from "./config/loadConfig";
let loadConfig = new LoadConfig();


//The environment on which we run the tests, the default locale. Selectable “local” and “staging”
let environment: string = "local";

// load config and configurations
const configPath = loadConfig.selectConfig(environment, testConfig, testConfigLocal);

export default defineConfig<CustomTestOptions>({
    timeout: 30000,
    workers: 1,
    retries: 0,

    //test file
    testDir: "./tests/",
    outputDir: "./test-results/",

    // Reporter to use
    reporter: [
        ["html"],
    ],

    use: {
        //action after test error
        //take a screenshot after error
        screenshot: "only-on-failure",

        //save a video after error
        video: "retain-on-failure",

        //save a trace after error
        trace: "retain-on-failure",
        viewport: { width: 1200, height: 1200 },
        headless: true,
        testConfig: {
            api: {
                baseURL: configPath.api.baseURL,
            },
        }
    },
    // Configure projects for major browsers.
    projects: [
        {
            name: "chromium",
            use: {
                ...devices["Desktop Chrome"],
                contextOptions: {
                    reducedMotion: "reduce",
                },
            },
        },
        {
            name: 'Firefox',
            use: {
                ...devices['Desktop Firefox'],
                contextOptions: {
                    reducedMotion: "reduce",
                },
            },
        },
        {
            name: 'WebKit',
            use: {
                ...devices['Desktop Safari'],
                contextOptions: {
                    reducedMotion: "reduce",
                },
            },
        },
    ],

    //Configuration for the expect assertion library.
    expect: {
        // Maximum time expect() should wait for the condition to be met.
        timeout: 10000,

        //screenShots comparer configuration
        toHaveScreenshot: {
            // An acceptable amount of pixels that could be different, unset by default.
            maxDiffPixelRatio: 0.1,
        },
        toMatchSnapshot: {
            // An acceptable ratio of pixels that are different to the
            // total amount of pixels, between 0 and 1.
            maxDiffPixelRatio: 0.1,
        },
    },
});