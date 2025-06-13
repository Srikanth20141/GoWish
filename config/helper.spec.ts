export async function switchLanguage(page, language:string = 'English') {
  await page.getByRole('img', { name: 'language_da' }).click();
  await page.getByText(language).click();
}

export async function buttonClick(page, buttonName:string) {
  await page.getByRole('button', { name: buttonName }).click();
}