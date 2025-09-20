import { BrowserContext, Locator, Page } from "@playwright/test";
import testConfig from "@config/*";

export enum Message {
	loginErrorMessage = 'Epic sadface: Username and password do not match any user in this service',
}

interface Elements {
	userNameInput: Locator;
	passwordInput: Locator;
	errorMessage: Locator;
}

interface Buttons {
	loginButton: Locator;
}

export class LoginPage {
	readonly page: Page;
	readonly context: BrowserContext;
	readonly buttons: Buttons;
	readonly elements: Elements;
	readonly message = Message;
	readonly config = testConfig.use!.testConfig!;

	constructor(page: Page, context: BrowserContext) {
		this.page = page;
		this.context = context;
		this.elements = {
			userNameInput: page.locator('#user-name'),
			passwordInput: page.locator('#password'),
			errorMessage: page.locator('h3[data-test="error"]'),
		};
		this.buttons = {
			loginButton: page.locator('#login-button'),
		};
	}

	async login(userName = this.config!.web.login, password = this.config!.web.password): Promise<void> {
		await this.elements.userNameInput.fill(userName);
		await this.elements.passwordInput.fill(password);
		await this.buttons.loginButton.click();
	}

	async getUrl(): Promise<string> {
		return this.page.url();
	}
}