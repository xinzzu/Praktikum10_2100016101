// ! Dont change this code
const {
  fetchProductsData,
  setProductsCards,
  convertToRupiah,
  countDiscount,
} = require("../src/index.js");
const cartData = require("../src/data/cart.js");
const { fetchCartsData } = require("../src/dataService.js");
const { default: axios } = require("axios");

// @ Write your code here

// Tugas 1
describe('Product API Testing', () => {

  // Test Case 1 
  test('should return product data with id 1', async () => {
    const productId = 1;
    const productData = await fetchProductsData(productId)
    expect(productData).toBeDefined();
    expect(productData.id).toBe(productId)
  })

  // Test Case 2
  test('should check products.length with limit', async () => {
    const limit = 35;
    const productData = await fetchProductsData();
    expect(productData).toBeDefined();
    expect(productData.products.length).toBeLessThanOrEqual(limit);
  });

  // Test Case 3
  test('should return product data with a specific title', async () => {
    const specificTitle = 'Eau De Perfume Spray';
    const productData = await fetchProductsData();
    expect(productData).toBeDefined();
    const productWithTitle = productData.products.find(p => p.title === specificTitle);
    expect(productWithTitle).toBeDefined();
    expect(productWithTitle.title).toBe(specificTitle);
  })
})

// Tugas 2
describe('Cart API Testing', () => {
  beforeEach(() => {
    jest.spyOn(axios, 'get').mockResolvedValue({ data: cartData });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Cart data fetches successfully!', async () => {
    const result = await axios.get('https://dummyjson.com/carts');
    expect(result.data).toEqual(cartData);
  });

  it('compares the length of all carts with the total', async () => {
    const result = await axios.get('https://dummyjson.com/carts');
    expect(result.data.carts.length).toBe(cartData.total);
  });
});

describe('Product Utility Testing', () => {
  let products;

  beforeAll(async () => {
    const productData = await fetchProductsData();
    products = productData.products;
  });

  test('convertToRupiah should convert the price correctly', () => {
    const price = 2000;
    const convertedPrice = convertToRupiah(price);
    expect(convertedPrice).toMatch(/Rp\s*30\.872\.000,00/);
  });

  test('convertToRupiah should handle different price values', () => {
    const price = 10000;
    const convertedPrice = convertToRupiah(price);
    expect(convertedPrice).toMatch(/Rp\s*154\.360\.000,00/);
  });

  test('countDiscount should calculate the discounted price correctly', () => {
    const price = 2000;
    const discountPercentage = 25;
    const discountedPrice = countDiscount(price, discountPercentage);
    expect(discountedPrice).toBe(1500);
  });
  test('countDiscount should calculate the discounted price correctly', () => {
    const price = 1000;
    const discountPercentage = 20;
    const discountedPrice = countDiscount(price, discountPercentage);
    expect(discountedPrice).toBe(800);
  });

  test('setProductsCards should have correct keys', () => {
    const productsCards = setProductsCards(products);
    expect(productsCards[1]).toHaveProperty('price');
    expect(productsCards[1]).toHaveProperty('after_discount');
    expect(productsCards[1]).toHaveProperty('image');
  });
});
