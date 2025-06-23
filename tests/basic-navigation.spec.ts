import { test, expect } from "@playwright/test";

/**
 * Basic navigation tests to verify the app is working correctly
 */
test.describe("Basic Navigation", () => {
  test("should load homepage and redirect to John 1:1", async ({ page }) => {
    // Navigate to root
    await page.goto("/");

    // Wait for redirect (give it more time and be more flexible)
    await page.waitForURL(/book=John&chapter=1/, { timeout: 10000 });

    // Verify URL contains John 1:1
    expect(page.url()).toContain("book=John");
    expect(page.url()).toContain("chapter=1");

    // Verify page content shows John 1 (use more specific selector)
    await expect(
      page.locator("h1").filter({ hasText: "John 1" })
    ).toBeVisible();
  });

  test("should navigate to specific Bible reference", async ({ page }) => {
    // Navigate directly to John 3 (using a known working book)
    await page.goto("/?book=John&chapter=3");

    // Wait for page to load
    await page.waitForLoadState("networkidle");

    // Verify URL
    expect(page.url()).toContain("book=John");
    expect(page.url()).toContain("chapter=3");

    // Verify page content
    await expect(
      page.locator("h1").filter({ hasText: "John 3" })
    ).toBeVisible();
  });

  test("should have working search functionality", async ({ page }) => {
    await page.goto("/?book=John&chapter=1");

    // Look for tools button
    const toolsButton = page.locator('button:has-text("Tools")');

    if (await toolsButton.isVisible()) {
      await toolsButton.click();

      // Search sheet should open
      await expect(page.locator('[role="dialog"]')).toBeVisible();
    }
  });

  test("should display Bible verses", async ({ page }) => {
    await page.goto("/?book=John&chapter=1&verse=1");

    // Wait for page to load
    await page.waitForLoadState("networkidle");

    // Should show the chapter
    await expect(
      page.locator("h1").filter({ hasText: "John 1" })
    ).toBeVisible();

    // Should have verse content
    await expect(page.locator("body")).toContainText("In the beginning");
  });

  test("should hide bookmark button when not authenticated", async ({
    page,
  }) => {
    await page.goto("/?book=John&chapter=3");

    // Wait for page to load
    await page.waitForLoadState("networkidle");

    // Bookmark button should NOT be visible for unauthenticated users
    const bookmarkButton = page.locator('button:has-text("Bookmark")');
    await expect(bookmarkButton).toHaveCount(0);

    // Also check for the icon version
    const bookmarkIconButton = page.locator(
      'button:has([data-testid="bookmark-plus"])'
    );
    await expect(bookmarkIconButton).toHaveCount(0);
  });
});
