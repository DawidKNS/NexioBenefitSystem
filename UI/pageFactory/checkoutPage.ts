import { BrowserContext, Locator, Page } from "@playwright/test";


export enum CheckoutMessage {
    thankYou = 'Thank you for your order!',
}

interface Elements {
    thankYouMessage: Locator;
}

interface Buttons {
    finish: Locator;
}

export class CheckoutPage {
    readonly page: Page;
    readonly context: BrowserContext;
    readonly buttons: Buttons;
    readonly elements: Elements;
    readonly checkoutMessage = CheckoutMessage;

    constructor(page: Page, context: BrowserContext) {
        this.page = page;
        this.context = context;
        this.elements = {
            thankYouMessage: page.locator('.complete-header'),
        };
        this.buttons = {
            finish: page.locator('[data-test="finish"]'),
        };
    }
}
