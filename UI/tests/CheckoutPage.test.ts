import { expect } from '@playwright/test';
import test from '@lib/baseTests';

test.beforeEach(async ({ runPage }) => {
	await runPage.navigateToURL();
});

test.describe('Checkout', async () => {
	test('Complete checkout flow successfully', async ({ loginPage, productsPage, cardPage, checkoutPage, checkoutFormBuilder }) => {
		await loginPage.login();

		await productsPage.addToCart();
		await cardPage.elements.shipingCart.click();
		await cardPage.buttons.checkout.click();

		await checkoutFormBuilder
			.withFirstName('Jan')
			.withLastName('Kowalski')
			.withPostalCode('00-001')
			.submit();
		await checkoutPage.buttons.finish.click();

		const thankYou = checkoutPage.elements.thankYouMessage;
		expect(thankYou).toBeVisible();
		expect(await thankYou.textContent()).toBe(checkoutPage.checkoutMessage.thankYou);
	});
});

test.afterEach(async ({ runPage }) => {
	await runPage.page.close();
});