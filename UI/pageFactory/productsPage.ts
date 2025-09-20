import { BrowserContext, Locator, Page } from "@playwright/test";

interface Elements {
	title: Locator;
	inventoryList: Locator;
	inventoryItem: Locator;
	inventoryItemName: Locator;
}

interface Buttons {
}

export class ProductsPage {
	readonly page: Page;
	readonly context: BrowserContext;
	readonly buttons: Buttons;
	readonly elements: Elements;

	constructor(page: Page, context: BrowserContext) {
		this.page = page;
		this.context = context;
		this.elements = {
			title: page.locator('[data-test="title"]'),
			inventoryList: page.locator('[data-test="inventory-list"]'),
			inventoryItem: page.locator('.inventory_item'),
			inventoryItemName: page.locator('[data-test="inventory_item_name"]'),
		};
		this.buttons = {
		};
	}

	async getPageTitle(): Promise<string> {
		return await this.elements.title.textContent() || '';
	}

	async getInventoryList(): Promise<Locator> {
		return this.elements.inventoryList;
	}

	async getInventoryItem(): Promise<Locator> {
		return this.elements.inventoryItem;
	}

	async getInventoryItemName(): Promise<Locator> {
		return this.elements.inventoryItemName;
	}

	async addToCart(): Promise<void> {
		const firstProduct = this.elements.inventoryItem.first();
		await firstProduct.locator('button').click();
	}
}