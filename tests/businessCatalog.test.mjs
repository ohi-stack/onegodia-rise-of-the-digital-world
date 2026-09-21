import test from 'node:test';
import assert from 'node:assert/strict';
import { businessCatalog, realMoneyPackages } from '../src/data/businessCatalog.js';

test('publishes the approved 12-business prototype-credit catalog', () => {
  assert.equal(businessCatalog.length, 12);
  assert.deepEqual(
    businessCatalog.map(({ name, priceCredits }) => [name, priceCredits]),
    [
      ['Corner Market', 12500],
      ['Café', 18000],
      ['Auto Detail', 24000],
      ['Creative Studio', 30000],
      ['Repair Garage', 35000],
      ['Delivery & Logistics', 42500],
      ['Restaurant', 55000],
      ['Construction Services', 75000],
      ['Property Management', 90000],
      ['Technology Company', 120000],
      ['Entertainment Venue', 150000],
      ['Property Development Company', 250000],
    ]
  );
});

test('business ids are unique and prices increase with progression', () => {
  const ids = businessCatalog.map(({ id }) => id);
  assert.equal(new Set(ids).size, ids.length);
  for (let i = 1; i < businessCatalog.length; i += 1) {
    assert.ok(businessCatalog[i].priceCredits > businessCatalog[i - 1].priceCredits);
  }
});

test('Genesis Business Starter Pack is $29.99 and checkout remains disabled until configured', () => {
  const starter = realMoneyPackages.find(({ id }) => id === 'genesis-business-starter-pack');
  assert.ok(starter);
  assert.equal(starter.priceCents, 2999);
  assert.equal(starter.checkoutStatus, 'disabled-until-stripe-price-configured');
  assert.equal(starter.virtualGameProduct, true);
});
