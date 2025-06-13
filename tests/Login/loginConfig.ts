import { test as base } from '@playwright/test';

export interface TestOptions {
  user: {
    email: string;
    password: string;
  };
};

export const LoginConfig = base.extend<TestOptions>({
  user: async ({}, use) => {
    const user = {
      email: 'Iva72@hotmail.com',
      password: 'Welcome@123',
    };
    await use(user);
  },
});
