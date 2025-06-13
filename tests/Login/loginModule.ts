import { expect, Page } from "@playwright/test";

export class LoginModule {
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

    async clickLoginButton() {
        await this.page.getByRole('dialog').getByRole('button', { name: 'Log in' }).click();
    }

}
