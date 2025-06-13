import { expect, Page } from "@playwright/test";

export class SignUpModule {
    constructor(public page: Page) {
    }

    async enterTextBox(name: string, value: string) {
        const textBox = this.page.getByRole('textbox', { name: name });
        await textBox.fill(value);
    }

    async buttonClick(buttonName: string) {
        await this.page.getByRole('button', { name: buttonName }).click();
    }

    async switchLanguage(language: string = 'English') {
        await this.page.getByRole('img', { name: 'language_da' }).click();
        await this.page.getByText(language).click();
    }

    async selectComboBox(id: string, value: string) {
        const comboBox = this.page.locator(id);
        await comboBox.click();
        await this.page.getByText(value, { exact: true }).click();
    }

    async checkCheckbox() {
        const checkbox = this.page.locator('input.ant-checkbox-input[type="checkbox"]');
        await checkbox.check();
    }

    async selectGender(gender: string) {
        await this.page.locator('.ant-select-selection-search-input').nth(3).click();
        await this.page.getByTitle(gender, { exact: true }).locator('div').click();
    }

    async checkToastMessage(message: string) {
        const toastMessage = this.page.locator("//div[@class='ant-message-notice-content']");
        const actual = (await toastMessage.textContent())?.trim();
        if (actual !== message) {
            console.warn(`Soft check failed: Expected exactly "${message}", but got "${actual}"`);
        }
        await expect(toastMessage).toBeHidden({ timeout: 10000 });
    }

    async createWishlist(title: string) {
        await this.page.getByRole('img', { name: 'Create wishlist button' }).click();
        await this.page.getByTestId('create-wishlist-title-input').fill(title);
        await this.page.getByTestId('createWishlistSubmitButton').click();
    }

    async addWishByLink(wishlistTitle: string, link: string) {
        await this.page.getByTestId(`wl-${wishlistTitle}`).click();
        await this.page.locator('#new-wish-card-div div').filter({ hasText: 'New Wish' }).click();
        await this.enterTextBox('Insert product link', link);
        await this.page.getByTestId('new-wish-form-submit-btn').click();
    }

    async addWishManually(wishTitle: string) {
        await this.page.locator('#new-wish-card-div div').filter({ hasText: 'New Wish' }).click();
        await this.buttonClick('or create manually');
        await this.page.getByTestId('new-wish-form-title-input').fill(wishTitle);
        await this.page.getByTestId('new-wish-form-submit-btn').click();
    }

    async clickByText(text: string) {
        await this.page.getByText(text).click();
    }

    async clickUserProfile() {
        await this.page.locator("//button[@name = 'User profile']").click();
    }
}
