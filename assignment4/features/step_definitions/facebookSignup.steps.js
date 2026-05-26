require("dotenv").config();

const fs = require("node:fs");
const assert = require("node:assert/strict");
const {
  Before,
  After,
  Given,
  When,
  Then,
  setDefaultTimeout,
} = require("@cucumber/cucumber");
const { Builder, By, until } = require("selenium-webdriver");
const firefox = require("selenium-webdriver/firefox");

setDefaultTimeout(60 * 1000);

let driver;

// Show error in case of missing value in .env file
function getRequiredEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing ${name} in the .env file.`);
  }

  return value;
}

//Wait until an element is loaded and visible
async function findVisible(locator, timeout = 10000) {
  const element = await driver.wait(until.elementLocated(locator), timeout);
  await driver.wait(until.elementIsVisible(element), timeout);
  return element;
}

// Find a text input using the visible label attached to it. Read current ID from the label.
async function findInputByLabel(labelText) {
  const label = await findVisible(
    By.xpath(`//label[normalize-space(.)="${labelText}"]`)
  );

  const inputId = await label.getAttribute("for");

  if (!inputId) {
    throw new Error(`Could not find an input connected to label: ${labelText}`);
  }

  return await findVisible(By.id(inputId));
}

// Select an option from Facebook's custom dropdown controls.
async function selectCustomOption(comboboxLabel, optionText) {
  const combobox = await findVisible(
    By.css(`[role="combobox"][aria-label="${comboboxLabel}"]`)
  );

  await combobox.click();

  const option = await findVisible(
    By.xpath(
      `//*[@role='option' and normalize-space(.)='${optionText}']`
    )
  );

  await option.click();
}

// Click a Facebook button using its visible text.
async function clickButtonByText(buttonText) {
  const textElement = await findVisible(
    By.xpath(
      `//span[normalize-space(.)="${buttonText}" ` +
      `and not(.//span[normalize-space(.)="${buttonText}"])]`
    )
  );

  const button = await textElement.findElement(
    By.xpath("./ancestor::*[@role='button'][1]")
  );

  await driver.executeScript(
    "arguments[0].scrollIntoView({ block: 'center' });",
    button
  );

  await button.click();
}

Before(async function () {
  const options = new firefox.Options();

  driver = await new Builder()
    .forBrowser("firefox")
    .setFirefoxOptions(options)
    .build();

  await driver.manage().setTimeouts({
    implicit: 0,
    pageLoad: 30000,
    script: 30000,
  });

  await driver.manage().window().maximize();
});

After(async function (scenario) {
  if (!driver) {
    return;
  }

  if (scenario.result && scenario.result.status !== "PASSED") {
    const screenshot = await driver.takeScreenshot();
    fs.writeFileSync("facebook-signup-failure.png", screenshot, "base64");
    console.log("Test failed. Screenshot saved as facebook-signup-failure.png");
  }

  await driver.quit();
});

Given("I open the Facebook signup page", async function () {
  await driver.get("https://www.facebook.com/signup");

  const cookieText = await findVisible(
    By.xpath(
      "//span[normalize-space(.)='Decline optional cookies' " +
      "and not(.//span[normalize-space(.)='Decline optional cookies'])]"
    ),
    10000
  );

  const cookieButton = await cookieText.findElement(
    By.xpath("./ancestor::*[@role='button'][1]")
  );

  await driver.actions()
    .move({ origin: cookieButton })
    .click()
    .perform();

  // The new form has no name="firstname"; identify it by its label.
  await findInputByLabel("First name");
});

When("I enter a first name and surname", async function () {
  const firstName = getRequiredEnv("FB_TEST_FIRSTNAME");
  const surname = getRequiredEnv("FB_TEST_SURNAME");

  const firstNameInput = await findInputByLabel("First name");
  const surnameInput = await findInputByLabel("Last name");

  await firstNameInput.sendKeys(firstName);
  await surnameInput.sendKeys(surname);
});

When("I select my date of birth", async function () {
  const day = getRequiredEnv("FB_TEST_BIRTH_DAY");
  const month = getRequiredEnv("FB_TEST_BIRTH_MONTH");
  const year = getRequiredEnv("FB_TEST_BIRTH_YEAR");

  await selectCustomOption("Select Month", month);
  await selectCustomOption("Select Day", day);
  await selectCustomOption("Select Year", year);
});

When("I select my gender", async function () {
  const gender = getRequiredEnv("FB_TEST_GENDER");

  const genderDropdown = await findVisible(
    By.xpath(
      "//*[@role='combobox' and .//span[normalize-space()='Select your gender']]"
    )
  );

  await genderDropdown.click();

  const genderOption = await findVisible(
    By.xpath(`//*[@role='option' and normalize-space()='${gender}']`)
  );

  await genderOption.click();
});

When("I enter a valid email address", async function () {
  const email = getRequiredEnv("FB_TEST_EMAIL");

  const emailInput = await findInputByLabel("Mobile number or email");

  await emailInput.sendKeys(email);
});

When("I enter a valid password", async function () {
  const password = getRequiredEnv("FB_TEST_PASSWORD");

  const passwordInput = await findInputByLabel("Password");

  await passwordInput.sendKeys(password);
});


When("I click Submit", async function () {
  await clickButtonByText("Submit");
});

Then("I should see the email confirmation code form", async function () {
  const confirmationHeading = await findVisible(
    By.xpath("//span[normalize-space(.)='Enter the confirmation code']"),
    15000
  );

  assert.equal(
    (await confirmationHeading.getText()).trim(),
    "Enter the confirmation code"
  );

  const confirmationInput = await findInputByLabel("Confirmation code");

  assert.equal(
    await confirmationInput.getAttribute("maxlength"),
    "5"
  );
});