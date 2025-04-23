import { useDispatch, useSelector } from "react-redux"
import { clearCart } from "../../redux/features/cart/cartSlice"
import { loadStripe } from "@stripe/stripe-js"
import { getBaseUrl } from "../../utils/baseURL"
import { useEffect } from "react";

const OrderSummary = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const products = useSelector((store) => store.cart.products);

    const { 
        selectedItems, 
        totalPrice, 
        tax, 
        taxRate, 
        grandTotal, 
        discountApplied, 
        discountMessage,
        discountAmount,
        subtotalAfterDiscount
    } = useSelector((store) => store.cart);

    const handleClearCart = () => {
        dispatch(clearCart());
    };

    // Payment integration
    const makePayment = async (e) => {
        e.preventDefault();
        const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PK);
        const body = {
            products: products,
            userId: user?._id,
            userRole: user?.role || "regular",
            discountApplied: discountApplied,
            discountAmount: discountAmount,
            grandTotal: grandTotal
        };

        const headers = {
            "Content-Type": "application/json",
        };

        const response = await fetch(`${getBaseUrl()}/api/orders/create-checkout-session`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body),
        });

        const session = await response.json();

        const result = await stripe.redirectToCheckout({
            sessionId: session.id,
        });

        if (result.error) {
            console.log("Error: ", result.error);
        }
    };

    return (
        <div className="bg-primary-light mt-5 rounded text-base">
            <div className="px-6 py-4 space-y-5">
                <h2 className="text-xl text-dark">Order Summary</h2>
                <p className="text-text-dark mt-2">Selected Items: {selectedItems}</p>
                <p>Subtotal: ${totalPrice.toFixed(2)}</p>
                
                {/* Discount display */}
                {discountApplied && (
                    <>
                        <p className="text-green-500">Discount: -${discountAmount.toFixed(2)}</p>
                        <p>Subtotal after discount: ${subtotalAfterDiscount.toFixed(2)}</p>
                    </>
                )}
                
                <p>Tax ({taxRate * 100}%): ${tax.toFixed(2)}</p>
                <h3 className="font-bold">Grand Total: ${grandTotal.toFixed(2)}</h3>

                {/* Discount message */}
                {discountMessage && (
                    <p className={`text-sm ${discountApplied ? 'text-green-500' : 'text-yellow-600'}`}>
                        {discountMessage}
                    </p>
                )}

                <div className="px-4 mb-6">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleClearCart();
                        }}
                        className="bg-red-500 px-3 py-1.5 text-white mt-2 rounded-md flex justify-between items-center mb-4"
                    >
                        <span className="mr-2">Clear cart</span>
                        <i className="ri-delete-bin-7-line"></i>
                    </button>
                    <button
                        onClick={makePayment}
                        className="bg-green-600 px-3 py-1.5 text-white mt-2 rounded-md flex justify-between items-center"
                    >
                        <span className="mr-2">Checkout</span>
                        <i className="ri-bank-card-line"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;