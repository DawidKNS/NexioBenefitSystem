import { PlaywrightWorkerOptions, PlaywrightTestOptions } from "@playwright/test";

declare global {
    interface TestConfig {
        web: Web;
    }

    interface Web {
        url: string;
        login: string;
        password: string;
    }

    interface CustomTestOptions extends PlaywrightTestOptions, PlaywrightWorkerOptions {
        testConfig: TestConfig;
    }
}

export class LoadConfig {

    /**
     * Config selector function.
     * @param env name of the environment" staging - sandbox or local - local
     * @param testConfig server config path
     * @param testConfigLocal local konfig path
     * @returns returned path to selected config
     */
    public selectConfig(env: string, testConfig: TestConfig, testConfigLocal: TestConfig) {
        let configPath = testConfigLocal;

        switch (env) {
            case "staging":
                configPath = testConfig;
                break;
            case "local":
                configPath = testConfigLocal;
                break;
            default:
                configPath = testConfigLocal;
                break;
        }

        // return path configutation
        return configPath;
    }
}