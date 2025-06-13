import { test, expect } from '@playwright/test';
import { LoginModule } from './loginModule';
import { LoginConfig } from './loginConfig';

LoginConfig('@Login', async ({ page, user }) => {
  const login = new LoginModule(page);

  await test.step('Create user account', async () => {
    await page.goto('/');

    // Accept cookies if visible
    const acceptBtn = page.getByRole('button', { name: 'Accepter alle' });
    if (await acceptBtn.isVisible()) {
      await login.buttonClick('Accepter alle');
      await expect(page).toHaveTitle('Ønskeskyen | Danmarks mest populære ønske- og huskeliste');
      await login.switchLanguage();
    }

    // Login flow
    await login.buttonClick('Log in');
    await login.buttonClick('photo Continue with e-mail');
    await login.enterTextBox('Email', user.email);
    await login.enterTextBox('Password', user.password);
    await login.clickLoginButton();
    await expect(page.getByTestId('navBar').getByText('WishlistsActivityInspiration')).toBeVisible({ timeout: 10000 });
  });
});