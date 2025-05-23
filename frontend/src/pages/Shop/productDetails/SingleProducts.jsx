import React from 'react'
import {Link, useParams} from 'react-router-dom'
import RatingStars from '../../../components/RatingStars'
import { useDispatch, useSelector } from 'react-redux'
import { useFetchProductByIdQuery } from '../../../redux/features/products/productsApi'
import { addToCart } from '../../../redux/features/cart/cartSlice'
import ReviewsCard from '../reviews/ReviewsCard'

const SingleProducts = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const role = useSelector((state) => state.auth.user?.role)
    const { data, error, isLoading } = useFetchProductByIdQuery(id);

    const singleProduct = data?.product || {};
    const productReviews = data?.reviews || {};

    const handleAddToCart = (product) => {
        dispatch(addToCart({ product, userRole: user?.role || "regular" }));
    };



    if(isLoading) return <p>Loading....</p>
    if(error) return <p>Error leading product details.</p>
  return (
    <>
        <section className ="section__container bg-primary-light">
            <h2 className = "section__header capitalize">Single Product Page</h2>
            <div className="section__subheader space-x-2">
                <span className="hover:text-primary"><Link to = "/">Home</Link></span>
                <i className = "ri-arrow-right-s-line"></i>
                <span className="hover:text-primary"><Link to = "/shop">Shop</Link></span>
                <i className = "ri-arrow-right-s-line"></i>
                <span className="hover:text-primary">{singleProduct.name}</span>
            </div>
        </section>

        <section className = "section__container mt-8">
            <div className = "flex flex-col items-center md:flex-row gap-8">
                {/*product image */}
                <div className = "md:w-1/2 w-full">
                    <img src={singleProduct?.image} alt="" 
                    className = "rounded-md w-full h-auto"/>
                </div>
                <div className = "md: w-1/2 md:w-full">
                    <h3 className = "text-2x; font-semibold mb-4">{singleProduct?.name}</h3>
                    <p className = "text-xl text-primary mb-4">
                    {role === "wholesaler" && singleProduct.wholesalerPrice ? (
                        <>
                            {singleProduct.wholesalerPrice}{" "}
                            <s className="text-gray-500">{singleProduct.price}</s>
                        </>
                        ) : (
                        singleProduct.price
                    )}
                    </p>
                    <p className = "text-gray-700 mb-4">{singleProduct?.description}</p>

                    {/* Additional information */}
                    <div className = "flex flex-col space-y-2">
                        <p><strong>Category: </strong> {singleProduct?.category}</p></div>
                    <div className = "flex gap-1 items-center">
                        <strong>Rating:</strong>
                        <RatingStars rating = {singleProduct?.rating} />
                    </div>

                    <button onClick={(e) => {
                        e.stopPropagation()
                        handleAddToCart(singleProduct)
                    }} className = "mt-6 px-6 py-3 bg-primary text-white rounded-md">
                        Add to Cart
                    </button>
                    
                </div>
            </div>
        </section>

        {/*Display Reviews */}
        <section className = "section__container mt-8">
            <ReviewsCard productReviews = {productReviews}/>
        </section>
    </>
  )
}

export default SingleProducts