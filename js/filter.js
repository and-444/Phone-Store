class Filter {
  constructor() {
    this.products = this.getProducts();
  }

  async getProducts() {
    try {
      const data = await fetch("http://localhost:3000/product/render");
      const products = await data.json();
      return products;
    } catch (e) {
      console.log(e);
    }
  }

  checkCategories(categories, product) {
    if (categories.length === 0) return true;
    return categories.includes(product.type);
  }

  checkPrice(min, max, productPrice) {
    return productPrice >= min && productPrice <= max;
  }

  checkMemory(memory, productMemory) {
    if (memory.length === 0) return true;
    return memory.some((el) => productMemory.includes(el));
  }

  checkColor(color, productColor) {
    if (color.length === 0) return true;

    return color.some((el) => productColor.includes(el));
  }
}

export default new Filter();
