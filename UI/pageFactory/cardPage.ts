import { BrowserContext, Locator, Page } from "@playwright/test";

interface Elements {
	shipingCart: Locator;
	cardItem: Locator;
	shipingCartBadge: Locator;
}

interface Buttons {
	checkout: Locator;
}

export class CardPage {
	readonly page: Page;
	readonly context: BrowserContext;
	readonly buttons: Buttons;
	readonly elements: Elements;

	constructor(page: Page, context: BrowserContext) {
		this.page = page;
		this.context = context;
		this.elements = {
			shipingCart: page.locator('.shopping_cart_link'),
			cardItem: page.locator('.cart_item'),
			shipingCartBadge: page.locator('.shopping_cart_badge'), 
		};
		this.buttons = {
			checkout: page.locator('[data-test="checkout"]'),
		};
	}

	async removeFromCart(): Promise<void> {
		const firstCartItem = this.elements.cardItem.first();
		await firstCartItem.locator('button').click();
	}
}
