import { test as baseTest } from '@playwright/test';
import { RunPage } from "@pages/runPage";
import { LoginPage } from "@pages/loginPage";
import { ProductsPage } from '@pages/productsPage';
import { CardPage } from '@pages/cardPage';
import { CheckoutPage } from '@pages/checkoutPage';
import { CheckoutFormBuilder } from '@pages/checkoutFormBuilder';

const test = baseTest.extend<{
	runPage: RunPage;
	loginPage: LoginPage;
	productsPage: ProductsPage;
	cardPage: CardPage;
	checkoutPage: CheckoutPage;
	checkoutFormBuilder: CheckoutFormBuilder;
}>({
	runPage: async ({ page, context }, use) => {
		await use(new RunPage(page, context));
	},
	loginPage: async ({ page, context }, use) => {
		await use(new LoginPage(page, context));
	},
	productsPage: async ({ page, context }, use) => {
		await use(new ProductsPage(page, context));
	},
	cardPage: async ({ page, context }, use) => {
		await use(new CardPage(page, context));
	},
	checkoutPage: async ({ page, context }, use) => {
		await use(new CheckoutPage(page, context));
	},
	checkoutFormBuilder: async ({ page }, use) => {
		await use(new CheckoutFormBuilder(page));
	}
})

export default test;