import { Page, Locator } from '@playwright/test';

interface Elements {
    fisrtName: Locator;
    lastName: Locator;
    postalCode: Locator;
};

interface Buttons {
    continue: Locator;
}


export class CheckoutFormBuilder {
    private page: Page;
    private firstName = 'Jan';
    private lastName = 'Kowalski';
    private postalCode = '00-001';
    readonly elements: Elements;
    readonly buttons: Buttons;

    constructor(page: Page) {
        this.page = page;
        this.elements = {
            fisrtName: page.locator('[data-test="firstName"]'),
            lastName: page.locator('[data-test="lastName"]'),
            postalCode: page.locator('[data-test="postalCode"]'),
        };
        this.buttons = {
            continue: page.locator('[data-test="continue"]'),
        };
    }

    withFirstName(name: string): CheckoutFormBuilder {
        this.firstName = name;
        return this;
    }

    withLastName(name: string): CheckoutFormBuilder {
        this.lastName = name;
        return this;
    }

    withPostalCode(code: string): CheckoutFormBuilder {
        this.postalCode = code;
        return this;
    }

    async fill(): Promise<void> {
        await this.elements.fisrtName.fill(this.firstName);
        await this.elements.lastName.fill(this.lastName);
        await this.elements.postalCode.fill(this.postalCode);
    }

    async submit(): Promise<void> {
        await this.fill();
        await this.buttons.continue.click();
    }
}
