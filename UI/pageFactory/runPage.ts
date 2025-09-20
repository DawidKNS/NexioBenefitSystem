import { BrowserContext, Page } from '@playwright/test';
import testConfig from "@config/*";

export class RunPage {
	readonly page: Page;
	readonly context: BrowserContext;

	constructor(page: Page, context: BrowserContext) {
		this.page = page;
		this.context = context;
	}

	/**
	 * Open test browser and navigate to URLs
	 */
	public async navigateToURL(): Promise<import('@playwright/test').Response | null> {
		await this.page.waitForLoadState('networkidle');
		return await this.page.goto(testConfig.use!.testConfig!.web.url, { waitUntil: 'load' });
	}
}