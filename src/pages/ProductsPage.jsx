import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import styles from "../styles/styles";

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const categoryData = searchParams.get("category");
  const { allProducts, isLoading } = useSelector((state) => state.products);

  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [sortOption, setSortOption] = useState("newest");

  const filteredProducts = useMemo(() => {
    let products = allProducts ? [...allProducts] : [];

    if (categoryData) {
      products = products.filter((product) => product.category === categoryData);
    }

    if (searchQuery.trim()) {
      const keyword = searchQuery.trim().toLowerCase();
      products = products.filter((product) => {
        const text = `${product.name} ${product.description} ${product.category} ${product.tags || ""}`.toLowerCase();
        return text.includes(keyword);
      });
    }

    if (minPrice !== "") {
      const min = Number(minPrice);
      products = products.filter((product) => product.discountPrice >= min);
    }

    if (maxPrice !== "") {
      const max = Number(maxPrice);
      products = products.filter((product) => product.discountPrice <= max);
    }

    if (stockFilter === "inStock") {
      products = products.filter((product) => product.stock > 0);
    } else if (stockFilter === "outOfStock") {
      products = products.filter((product) => product.stock <= 0);
    }

    if (sortOption === "priceAsc") {
      products.sort((a, b) => a.discountPrice - b.discountPrice);
    } else if (sortOption === "priceDesc") {
      products.sort((a, b) => b.discountPrice - a.discountPrice);
    } else if (sortOption === "oldest") {
      products.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else {
      products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return products;
  }, [allProducts, categoryData, searchQuery, minPrice, maxPrice, stockFilter, sortOption]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Header activeHeading={3} />
          <br />
          <br />
          <div className={`${styles.section}`}>
            <div className="mb-8 rounded-lg border border-[#e6e6e6] bg-white p-4 shadow-sm">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Search keyword
                  </label>
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, category, description"
                    className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Min price
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="0"
                    className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Max price
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Any"
                    className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Stock status
                  </label>
                  <select
                    value={stockFilter}
                    onChange={(e) => setStockFilter(e.target.value)}
                    className="mt-1 w-full rounded border border-gray-300 bg-white px-3 py-2 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="all">All products</option>
                    <option value="inStock">In stock</option>
                    <option value="outOfStock">Out of stock</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Sort by
                  </label>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="mt-1 w-full rounded border border-gray-300 bg-white px-3 py-2 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="priceAsc">Price: Low to High</option>
                    <option value="priceDesc">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="mb-4 flex items-center justify-between gap-4 text-sm text-gray-600">
              <p>{filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setMinPrice("");
                  setMaxPrice("");
                  setStockFilter("all");
                  setSortOption("newest");
                }}
                className="rounded bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
              >
                Clear filters
              </button>
            </div>
            <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
              {filteredProducts &&
                filteredProducts.map((i, index) => (
                  <ProductCard data={i} key={index} />
                ))}
            </div>
            {filteredProducts && filteredProducts.length === 0 ? (
              <h1 className="text-center w-full pb-[100px] text-[20px]">
                No products Found!
              </h1>
            ) : null}
          </div>
          <Footer />
        </div>
      )}
    </>
  );
};

export default ProductsPage;
