const express = require("express")
const Order = require("./orders.model");
const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");
const Products = require("../products/products.model");
const router = express.Router()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

//create checkout session
router.post("/create-checkout-session", async(req, res) => {
    const { products, userRole } = req.body;

    try {
        const lineItems = products.map((product) => {
            const priceToUse = userRole === "wholesaler" && product.wholesalerPrice
                ? product.wholesalerPrice
                : product.price;
        
            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: product.name,
                        images: [product.image],
                        metadata: {
                            mongoDbId: product._id // Optional: for linking back
                        }
                    },
                    unit_amount: Math.round(priceToUse * 100)
                },
                quantity: product.quantity
            };
        });

        // Store MongoDB product details in the session metadata
        const productMetadata = products.map(product => ({
            id: product._id,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `http://localhost:5173/cancel`,
            metadata: {
                productDetails: JSON.stringify(productMetadata)
            }
        })
        res.json({id: session.id})
        
    } catch (error) {
        console.error("Error creating checkout session", error)
        res.status(500).send({message: "Failed to create checkout session"})
    }
})

//confirm payment
router.post("/confirm-payment", async (req, res) => {
    const { session_id } = req.body;
    try {
        const session = await stripe.checkout.sessions.retrieve(session_id, {
            expand: ["line_items", "payment_intent"]
        });

        const paymentIntentId = session.payment_intent.id;
        let order = await Order.findOne({ orderId: paymentIntentId });

        if (!order) {
            // Get product details from session metadata
            const productDetails = JSON.parse(session.metadata.productDetails || '[]');
            const productIds = productDetails.map(p => p.id);

            // Fetch full product info from DB
            const productsFromDB = await Products.find({ _id: { $in: productIds } });

            // Map line items with quantity and product details
            const orderProducts = session.line_items.data.map(item => {
                // Find corresponding product in our metadata
                const quantity = item.quantity;
                const stripeProductId = item.price.product;
                const stripeProductName = item.description;

                // Find the matching product from our database
                const matchingProduct = productsFromDB.find(p => p.name === stripeProductName);

                if (matchingProduct) {
                    return {
                        productId: matchingProduct.id,
                        name: matchingProduct.name,
                        price: matchingProduct.price,
                        image: matchingProduct.image,
                        quantity: quantity
                    };
                }

                // Fallback if no match found
                return {
                    productId: stripeProductId,
                    quantity: quantity,
                    name: item.description || "Unknown Product",
                    price: (item.amount_total / 100) / quantity,
                    image: item.images
                };
            });

            const amount = session.amount_total / 100;

            order = new Order({
                orderId: paymentIntentId,
                amount,
                products: orderProducts,
                email: session.customer_details.email,
                status: session.payment_intent.status === "succeeded" ? "pending" : "failed"
            });
        } else {
            // Prevent overwriting order status if it's already completed or processing
            if (order.status !== "completed" && order.status !== "shipped") {
                order.status = session.payment_intent.status === "succeeded" ? "processing" : "failed";
            }
        }

        await order.save();
        res.json(order);
    } catch (error) {
        console.error("Error confirming payment", error);
        res.status(500).send({ message: "Failed to confirm payment" });
    }
});


//get order by email address
router.get('/:email', async(req, res) => {
    const email = req.params.email
    if(!email){
        return res.status(400).send({message: "Email is required"})
    }
    try {
        const orders = await Order.find({email: email})
        if(orders.length === 0 || !orders) {
            return res.status(400).send({orders: 0, message: "No orders found for this email"})
        }
        res.status(200).send({orders})
    } catch (error) {
        console.error("Error fetching orders by email", error)
        res.status(500).send({message:"Failed to fetch orders by email"})
    }
})

//get order by id
router.get("/order/:id", async (req, res) => {
    try {
      const order = await Order.findOne({ orderId: req.params.id }) // query by Stripe orderId
      if (!order) {
        return res.status(404).send({ message: "Order not found" })
      }
      res.status(200).send(order)
    } catch (error) {
      console.error("Error fetching order by Stripe orderId", error)
      res.status(500).send({ message: "Failed to fetch order" })
    }
  })

//get all orders
router.get("/", verifyToken, verifyAdmin, async (req, res) => {
    try {
        const orders = await Order.find().sort({createdAt: -1})
        if(orders.length === 0){
            return res.status(404).send({message: "No orders found", orders: []})
        }
        res.status(200).send(orders)
    } catch (error) {
        console.error("Error fetching aaa orders", error)
        res.status(500).send({message:"Failed to fetch all orders"})
    }
})

//update order status
router.patch('/update-order-status/:id', verifyToken, verifyAdmin, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
  
    if (!status) {
      return res.status(400).send({ message: "Status is required" });
    }
  
    try {
      const order = await Order.findOne({ orderId: id });
  
      if (!order) {
        return res.status(404).send({ message: "Order not found" });
      }
  
      // Only update timestamp for new status
      if (!order.statusTimestamps[status]) {
        order.statusTimestamps[status] = new Date();
      }
  
      order.status = status;
      await order.save();
  
      res.status(200).json({
        message: "Order status updated successfully",
        order,
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).send({
        message: "Failed to update order status",
        error: error.message,
      });
    }
  });
  


//delete order
router.delete('/delete-order/:id', async(req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(id)
        if(!deletedOrder){
            return res.status(404).send({message: "Order not found"})
        }
        res.status(200).json({
            message: "Order deleted successfully",
            order:deletedOrder
        })
    } catch (error) {
        console.error("Error deleting order", error)
        res.status(500).send({message:"Failed to delete orders"})
    }
})


module.exports = router