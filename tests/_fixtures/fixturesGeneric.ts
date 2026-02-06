import { test as base } from '@playwright/test';
import type { Page } from '@playwright/test';
import type { BrowserContext } from 'playwright';
import { Logger } from '../../src/common/logger/Logger';
import * as allure from 'allure-js-commons';
import { parseTestTreeHierarchy } from '../../src/common/helpers/allureHelpers';
import fs from 'fs';
import path from 'path';
import {
    generateNewUserData,
    type User,
} from '../../src/common/testData/generateNewUser';

export const test = base.extend<
  {
    usersNumber: number;
    contextsNumber: number;
    pages: Page[];
    user: User;
    users: User[];
    infoTestLog: string;
    addAllureTestHierarchy: string;
  },
  {
    logger: Logger;
    cleanAllureResults: string;
  }
>({
  usersNumber: [1, { option: true }],
  contextsNumber: [1, { option: true }],
  pages: async ({ browser, contextsNumber }, use) => {
    const pages = Array(contextsNumber);
    const contexts: BrowserContext[] = [];

    for (let i = 0; i < contextsNumber; i++) {
      const context = await browser.newContext();
      contexts.push(context);
      pages[i] = await context.newPage();
    }
    await use(pages);
    for (const ctx of contexts) {
      await (ctx as BrowserContext).close();
    }
  },
  user: async ({ logger }, use) => {
    const user = generateNewUserData(logger);
    await use(user);
  },
  users: async ({ logger, usersNumber }, use) => {
    const users = Array(usersNumber);

    for (let i = 0; i < usersNumber; i++) {
      users[i] = generateNewUserData(logger);
    }

    await use(users);
  },
  logger: [
    async ({}, use) => {
      const logger = new Logger('error');

      await use(logger);
    },
    { scope: 'worker' },
  ],

  infoTestLog: [
    async ({ logger }, use, testInfo) => {
      const indexOfTestSubfolderStart = testInfo.file.indexOf('/tests') + 7;
      const fileName = testInfo.file.substring(indexOfTestSubfolderStart);

      logger.info(`Test started: ${fileName}`);

      await use('infoTestLog');

      logger.info(`Test completed: ${fileName}`);
    },
    { scope: 'test', auto: true },
  ],

  addAllureTestHierarchy: [
    async ({ logger }, use, testInfo) => {
      const fileName = testInfo.file;

      const [parentSuite, suite, subSuite] = parseTestTreeHierarchy(
        fileName,
        logger,
      );

      await allure.parentSuite(parentSuite);
      await allure.suite(suite);
      if (subSuite) {
        await allure.subSuite(subSuite);
      }

      await use('addAllureTestHierarhy');
    },
    { scope: 'test', auto: true },
  ],
  
  cleanAllureResults: [
    async ({}, use) => {
      const allureResultsPath = path.join(process.cwd(), 'allure-results');

      if (fs.existsSync(allureResultsPath)) {
        fs.rmSync(allureResultsPath, { recursive: true, force: true });
      }

      await use('cleanAllureResults');
    },
    { scope: 'worker', auto: true },
  ],
});
