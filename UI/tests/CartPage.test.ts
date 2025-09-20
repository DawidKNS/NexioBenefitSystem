import { expect } from '@playwright/test';
import test from '@lib/baseTests';

test.beforeEach(async ({ runPage }) => {
	await runPage.navigateToURL();
});

test.describe('Cart Test', async () => {
	test('Add product to cart and verify cart', async ({ loginPage, productsPage, cardPage }) => {
		await loginPage.login();
		await productsPage.addToCart();
		await cardPage.elements.shipingCart.click();

		expect(await loginPage.getUrl()).toBe(loginPage.config.web.url + '/cart.html');
		expect(await cardPage.elements.cardItem.isVisible()).toBeTruthy();
	});

	test('Remove product from cart and verify empty cart', async ({ loginPage, productsPage, cardPage, page }) => {
		await loginPage.login();
		await productsPage.addToCart();
		await cardPage.elements.shipingCart.click();
		await cardPage.removeFromCart();
		expect(await cardPage.elements.cardItem.count()).toBe(0);
		expect(await cardPage.elements.shipingCartBadge.count()).toBe(0);
	});
});

test.afterEach(async ({ runPage }) => {
	await runPage.page.close();
});