import { faker } from '@faker-js/faker';
import { test as base } from '@playwright/test';
import * as fs from 'fs';

export interface TestOptions {
  user: {
    email: string;
    firstName: string;
    lastName: string;
    productLink?: string;
  };
};

export const SignUpConfig = base.extend<TestOptions>({
  user: async ({ }, use) => {
    const user = {
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
    };
    fs.writeFileSync('config/user.json', JSON.stringify(user, null, 2));
    await use(user);
  }
});

export const productLink = 'https://www.amazon.de/-/en/Sahara-Sailor-BPA-Free-Leak-Proof-Camping/dp/B09FPXGLGF/?_encoding=UTF8&pd_rd_w=uI1KK&content-id=amzn1.sym.cd74953f-b529-416f-aef4-f3454e124e78&pf_rd_p=cd74953f-b529-416f-aef4-f3454e124e78&pf_rd_r=RGRXRCMJC2EVT6AY8ENA&pd_rd_wg=726xa&pd_rd_r=7e745eb4-fd8b-4702-ba33-4f6c0ae6611e&ref_=pd_hp_d_btf_crs_zg_bs_16435051&th=1';