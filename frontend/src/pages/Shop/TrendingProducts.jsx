import ProductCards from "./ProductCards"
import { useState } from "react";
// import products from "../../data/products.json"
import { useFetchAllProductsQuery } from '../../redux/features/products/productsApi'

const TrendingProducts = () => {
    const [visibleProducts, setVisibleProducts] = useState(8);
    const loadMoreProducts = () => {
        setVisibleProducts(prevCount => prevCount + 4)
    }

    const {data:product, error, isLoading} = useFetchAllProductsQuery({
        rate: 1,
        limit: 100
    })
    // if(isLoading) return <div>Loading...</div>
    // if(error) return <div>Error</div>
    const products = product?.products || []
    console.log(products)


  return (
    <section className = "section__container product__container">
        <h2 className = "section__header">Trending Products</h2>
        <p className = "section__subheader mb-12">Discover the Hottest Picks: Elevate Your Style with Our Curated Collection of Trending Women&apos;s Fashion Products.</p>

        {/* product card */}
        <div className="mt-12">
            <ProductCards products = {products.slice(0, visibleProducts)}/>
        </div>

        {/* Load more products button */}
        <div className = "product__btn">
            {visibleProducts < products.length && (
                <button className = "btn" onClick = {loadMoreProducts}>Load More</button>
            )}
        </div>
        
    </section>
  )
}
export default TrendingProducts