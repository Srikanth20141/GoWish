import { test, expect } from '@playwright/test';
import { SignUpModule } from './signUpModule';
import { productLink, SignUpConfig } from './signUpConfig';

SignUpConfig('@SignUp', async ({ page, user }) => {
  const signUpModule = new SignUpModule(page);
  test.setTimeout(60000);
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

  });

  await test.step('create wishlist', async () => {
    await signUpModule.clickByText('Continue on web');
    await signUpModule.createWishlist('Test Wishlist');
    await signUpModule.checkToastMessage('Wishlist  created successfully');
  });

  await test.step('Add wish by link', async () => {
    await signUpModule.addWishByLink('Test Wishlist', productLink);
    await signUpModule.checkToastMessage('Wish  created successfully in Test Wishlist');
  });

  await test.step('Add wish manually', async () => {
    await signUpModule.addWishManually('Test 2');
    await signUpModule.checkToastMessage('Wish  created successfully in Test Wishlist');
  });

  await test.step('view the wish', async () => {
    const wishCard = page.getByTestId(/wish-Sahara Sailor/);
    await wishCard.getByRole('img', { name: 'photo' }).click();

    await expect(page.getByTestId('wish-title')).toContainText('Sahara Sailor Trinkflasche, BPA-Frei Tritan, 1L/500ML/750ML Auslaufsicher Trinkflasche mit Zeitmarkierung für Gym, Sport, Outdoor, Schule, Job');
    await expect(page.getByText('€')).toContainText('€10.99');
  });

  await test.step('Edit the wish', async () => {
    await page.getByTestId('more-button-popover').click();
    await signUpModule.clickByText('Edit wish');
    await page.getByTestId('new-wish-form-title-input').fill('Test Name new');
    await signUpModule.enterTextBox('Description', 'Test Description new');
    await signUpModule.enterTextBox('0', '9.99');
    await page.getByTestId('new-wish-form-submit-btn').click();
    await signUpModule.checkToastMessage('Wish  edited successfully');

    await expect(page.getByTestId('wish-title')).toContainText('Test Name new');
    await expect(page.getByTestId('wish-or-product-details').locator('div').nth(11)).toContainText('Test Description new');
    await expect(page.getByText('€')).toContainText('€9.99');
  });

  await test.step('Receive as gift', async () => {
    await page.getByTestId('more-button-popover').click();
    await signUpModule.clickByText('Received as gift');
    await signUpModule.buttonClick('Confirm');
    await signUpModule.checkToastMessage('Wish marked as gift successfully');
    // Verify the wish is received in my gifts
    await signUpModule.clickUserProfile();
    await signUpModule.clickByText('My Gifts');
    await expect(page.getByText('Test Name new')).toBeVisible({ timeout: 10000 });
  });

});