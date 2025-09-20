import { expect } from '@playwright/test';
import test from '@lib/baseTests';

test.beforeEach(async ({ runPage }) => {
	await runPage.navigateToURL();
});

test.describe('Login Page Test', async () => {
	test('Standard user login leads to inventory page', async ({ loginPage, productsPage }) => {
		await loginPage.login();

		expect(await loginPage.getUrl()).toBe(loginPage.config.web.url + '/inventory.html');
		expect(await productsPage.getPageTitle()).toBe('Products');
		expect(await productsPage.elements.inventoryList.isVisible()).toBeTruthy();
	});

	test('Login with invalid credentials shows error', async ({ loginPage }) => {
		await loginPage.login("fake_user", "wrong_pass");
		const error = loginPage.elements.errorMessage;

		expect(await error.isVisible()).toBeTruthy();
		expect(await error.allInnerTexts()).toContain(loginPage.message.loginErrorMessage);
		expect(await loginPage.getUrl()).toBe(loginPage.config.web.url + '/');
	});
});

test.afterEach(async ({ runPage }) => {
	await runPage.page.close();
});