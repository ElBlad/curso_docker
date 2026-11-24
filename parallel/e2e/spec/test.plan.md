# Checkout Operations Test Plan

## Application Overview

Functional and edge-case coverage for the Common Goods checkout flow. Every scenario assumes a fresh browser state and valid login credentials (client / Password123), unless the scenario explicitly tests an unauthenticated state.

## Test Scenarios

### 1. Bag and checkout entry

**Seed:** `tests/seed.spec.ts`

#### 1.1. Open checkout with an empty bag

**File:** `tests/checkout-empty.spec.ts`

**Steps:**
  1. Log in and do not add any products.
    - expect: The header “Your bag” count is 0.
    - expect: “View bag 0” is visible.
  2. Click “View bag 0”.
    - expect: The app opens `/checkout`.
    - expect: It shows “0 pieces”, “Your bag is waiting.”, and an `$0.00` total.
    - expect: Shipping is `Complimentary`.
  3. Click “Explore the collection”.
    - expect: The app returns to `/shop`.
    - expect: The bag remains empty.

#### 1.2. Add one product and open its bag

**File:** `tests/checkout-single-item.spec.ts`

**Steps:**
  1. Log in and add one Cedar candle.
    - expect: The product shows “1 in bag”.
    - expect: Header and “View bag” counts update to 1.
  2. Open the bag.
    - expect: Cedar candle appears in `/checkout`.
    - expect: Quantity is 1, line total is `$36.00`, and order total is `$36.00`.

#### 1.3. Add multiple products

**File:** `tests/checkout-multi-item.spec.ts`

**Steps:**
  1. Add one Cedar candle, one Everyday linen, and one Stoneware mug.
    - expect: Header bag count is 3.
    - expect: Each product shows one unit in bag.
  2. Open the bag.
    - expect: Three distinct line items appear.
    - expect: Line totals are `$36.00`, `$64.00`, and `$28.00`.
    - expect: The order total is `$128.00` and shipping is complimentary.

#### 1.4. Increment quantity and recalculate totals

**File:** `tests/checkout-quantity-increment.spec.ts`

**Steps:**
  1. Open `/checkout` with one Cedar candle.
    - expect: Quantity is 1 and total is `$36.00`.
  2. Click “Add one Cedar candle” twice.
    - expect: Quantity becomes 3.
    - expect: Bag count becomes 3.
    - expect: Line total becomes `$108.00`.
    - expect: Order total becomes `$108.00`.
    - expect: No duplicate line item is created.

#### 1.5. Decrement quantity and remove final unit

**File:** `tests/checkout-quantity-decrement.spec.ts`

**Steps:**
  1. Open `/checkout` with a Cedar candle at quantity 2.
    - expect: Bag count is 2 and order total is `$72.00`.
  2. Click “Remove one Cedar candle” once.
    - expect: Quantity becomes 1.
    - expect: Bag count becomes 1.
    - expect: Line and order total become `$36.00`.
  3. Click “Remove one Cedar candle” again.
    - expect: The item disappears.
    - expect: Bag count and piece count become 0.
    - expect: “Your bag is waiting.” appears.
    - expect: Total becomes `$0.00`.

#### 1.6. Back to collection navigation

**File:** `tests/checkout-navigation.spec.ts`

**Steps:**
  1. Add one item and open `/checkout`.
    - expect: Bag summary and delivery form are visible.
  2. Click “Back to collection”.
    - expect: The app returns to `/shop`.
    - expect: Bag quantity persists in the header and collection controls.
  3. Open the bag again.
    - expect: The item and total are restored without duplication.

### 2. Delivery form and order submission

**Seed:** `tests/seed.spec.ts`

#### 2.1. Reject empty delivery details

**File:** `tests/checkout-validation-empty.spec.ts`

**Steps:**
  1. Open `/checkout` with at least one item and leave all delivery fields blank.
    - expect: All three fields are visible with placeholders Maya, Chen, and Street address, city, ZIP.
  2. Click “Place your order”.
    - expect: Alert text is `Please complete your name and delivery address.`
    - expect: No order is placed.
    - expect: The page remains on `/checkout`.
    - expect: Bag contents and totals remain unchanged.

#### 2.2. Reject partially completed delivery details

**File:** `tests/checkout-validation-partial.spec.ts`

**Steps:**
  1. Open `/checkout` and test only first name, only last name, or only address.
    - expect: Each variant remains on `/checkout`.
    - expect: The completion alert is shown.
    - expect: No order is placed.
    - expect: Bag state remains intact.

#### 2.3. Place order with complete details

**File:** `tests/checkout-place-order.spec.ts`

**Steps:**
  1. Open `/checkout` with at least one item.
    - expect: The bag summary and total are accurate.
  2. Enter Maya in First name, Chen in Last name, and 123 Main St, Seattle, WA 98101 in Delivery address.
    - expect: Each value is retained in its field.
    - expect: No validation alert remains before submission.
  3. Click “Place your order”.
    - expect: An explicit success or order-confirmation state is shown.
    - expect: The completion-validation alert disappears.
    - expect: No duplicate order is created on repeated clicks.

#### 2.4. Reject whitespace-only delivery details

**File:** `tests/checkout-validation-whitespace.spec.ts`

**Steps:**
  1. Open `/checkout` and enter spaces in all three fields.
    - expect: Values do not falsely pass validation.
    - expect: Whitespace-only submission is rejected.
    - expect: Bag totals remain unchanged.

#### 2.5. Validate special characters and long input

**File:** `tests/checkout-input-boundaries.spec.ts`

**Steps:**
  1. Enter long plausible names and address text.
    - expect: Fields remain usable and no layout overflow occurs.
    - expect: Submission follows an explicit valid or invalid policy.
    - expect: No unexpected HTML rendering occurs.
  2. Enter punctuation and Unicode characters in name fields.
    - expect: The app does not execute any embedded markup.
    - expect: It either accepts harmless characters or reports a clear validation rule.

### 3. Session and history edge cases

**Seed:** `tests/seed.spec.ts`

#### 3.1. Direct unauthenticated checkout navigation

**File:** `tests/checkout-auth.spec.ts`

**Steps:**
  1. Use a fresh context and navigate directly to `/checkout`.
    - expect: Login is required before checkout.
    - expect: No checkout order or bag data is shown anonymously.

#### 3.2. Refresh checkout page

**File:** `tests/checkout-refresh.spec.ts`

**Steps:**
  1. Add an item, open `/checkout`, and refresh.
    - expect: Authentication remains valid.
    - expect: Bag contents, quantities, and totals remain correct if session state is intended to persist.
  2. Compare a refresh with an intentionally empty-bag state.
    - expect: The UI does not show stale item or total data.
    - expect: It shows an accurate empty-bag state if persistence is absent.

#### 3.3. Browser back and forward navigation

**File:** `tests/checkout-history.spec.ts`

**Steps:**
  1. Open `/checkout` from `/shop`, then use browser Back.
    - expect: Back returns to `/shop`.
    - expect: Bag state remains synchronized.
  2. Use browser Forward.
    - expect: Forward returns to `/checkout`.
    - expect: Items, quantities, and totals remain unchanged.
  3. Place an order and use browser Back.
    - expect: No duplicate order is submitted.
    - expect: The UI does not allow stale checkout state to create an unintended second order.
