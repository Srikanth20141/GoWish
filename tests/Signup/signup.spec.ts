import { test, expect } from '@playwright/test';
import { SignUpModule } from './signUpModule';
import { productLink, SignUpConfig } from './signUpConfig';

SignUpConfig('@SignUp', async ({ page, user }) => {
  const signUpModule = new SignUpModule(page);

  await test.step('Create user account', async () => {
    await page.goto('/');

    // Accept cookies if visible
    const acceptBtn = page.getByRole('button', { name: 'Accepter alle' });
    if (await acceptBtn.isVisible()) {
      await signUpModule.buttonClick('Accepter alle');
      await expect(page).toHaveTitle('Ønskeskyen | Danmarks mest populære ønske- og huskeliste');
      await signUpModule.switchLanguage();
    }

    // Sign up flow
    await signUpModule.buttonClick('Sign up');
    await signUpModule.buttonClick('photo Continue with e-mail');
    await signUpModule.enterTextBox('Email', user.email);
    await signUpModule.enterTextBox('Password', 'Welcome@123');
    await signUpModule.buttonClick('Next');
    await signUpModule.enterTextBox('First name', user.firstName);
    await signUpModule.enterTextBox('Last name', user.lastName);
    await signUpModule.selectComboBox('#registerSelectMonth', 'Mar');
    await signUpModule.selectComboBox('#registerSelectDay', '4');
    await signUpModule.selectComboBox('#registerSelectYear', '2007');
    await signUpModule.selectGender('Male');
    await signUpModule.checkCheckbox();
    await signUpModule.buttonClick('Create profile');
    await expect(page.getByText('Welcome to Ønskeskyen!')).toBeVisible({ timeout: 10000 });

    const locator = page.locator('.ant-modal-content .ant-modal-body');
    expect(await locator.screenshot()).toMatchSnapshot('signup-welcome.png', {  maxDiffPixelRatio: 0.02 });

    //await page.getByText('CONTINUE ON WEB').click();
    await signUpModule.clickByText('Continue on web');

    // Create wishlist
    await signUpModule.createWishlist('Test Wishlist');
    await signUpModule.checkToastMessage('Wishlist created successfully');

    // Add wish by link
    await signUpModule.addWishByLink('Test Wishlist', productLink);
    await signUpModule.checkToastMessage('Wish created successfully in');

    // Add wish manually
    await signUpModule.addWishManually('Test 2');
    await signUpModule.checkToastMessage('Wish created successfully in');
  });
});