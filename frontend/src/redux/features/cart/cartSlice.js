import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  selectedItems: 0,
  totalPrice: 0,
  tax: 0,
  taxRate: 0.05,
  grandTotal: 0,
  userRole: 'regular', // default value
  discountApplied: false, // Track if a discount has been applied
  discountMessage: '', // Message for the discount
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, userRole } = action.payload;
    
      // Update role in cart state
      state.userRole = userRole || 'regular';
    
      const productId = product._id || product.id;
      const isExist = state.products.find((p) =>
        (p._id === productId) || (p.id === productId)
      );
    
      if (!isExist) {
        state.products.push({
          ...product,
          id: productId,
          _id: productId,
          quantity: 1
        });
      } else {
        console.log("Item already added");
      }
    
      state.selectedItems = setSelectedItems(state);
      state.totalPrice = setTotalPrice(state);
      state.tax = setTax(state);
      state.grandTotal = setGrandTotal(state);
      // Check if discount should be applied after adding to cart
      checkDiscount(state);
    },

    updateQuantity: (state, action) => {
      const { id, type } = action.payload;
      
      // Find product checking both possible ID fields
      const productToUpdate = state.products.find(product => 
        (product.id === id) || (product._id === id)
      );
      
      if (productToUpdate) {
        if (type === "increment") {
          productToUpdate.quantity += 1;
        } else if (type === "decrement") {
          if (productToUpdate.quantity > 1) {
            productToUpdate.quantity -= 1;
          }
        }
      }

      state.selectedItems = setSelectedItems(state);
      state.totalPrice = setTotalPrice(state);
      state.tax = setTax(state);
      state.grandTotal = setGrandTotal(state);
      // Check if discount should be applied after updating quantity
      checkDiscount(state);
    },
    
    removeFromCart: (state, action) => {
      const id = action.payload;
      
      // Filter out the product with matching id or _id
      state.products = state.products.filter(product => 
        (product.id !== id) && (product._id !== id)
      );
      
      state.selectedItems = setSelectedItems(state);
      state.totalPrice = setTotalPrice(state);
      state.tax = setTax(state);
      state.grandTotal = setGrandTotal(state);
      // Check if discount should be applied after removing an item
      checkDiscount(state);
    },
    
    clearCart: (state) => {
      state.products = [];
      state.selectedItems = 0;
      state.totalPrice = 0;
      state.tax = 0;
      state.grandTotal = 0;
      state.discountApplied = false;
      state.discountMessage = '';
    },
    
    applyDiscount: (state, action) => {
      state.discountApplied = true;
      state.discountMessage = action.payload;
    },
    
    removeDiscount: (state) => {
      state.discountApplied = false;
      state.discountMessage = '';
    }
  },
});

// Utility functions
export const setSelectedItems = (state) =>
  state.products.reduce((total, product) => total + product.quantity, 0);

export const setTotalPrice = (state) =>
  state.products.reduce((total, product) => {
    const price = state.userRole === 'wholesaler' && product.wholesalerPrice
      ? product.wholesalerPrice
      : product.price;
    return total + product.quantity * price;
  }, 0);

export const setTax = (state) => setTotalPrice(state) * state.taxRate;

export const setGrandTotal = (state) => setTotalPrice(state) + setTax(state);

// Check if discount applies based on your conditions (e.g., cart total)
export const checkDiscount = (state) => {
  if (state.totalPrice >= 100) { // Example condition (e.g., total >= 100)
    if (!state.discountApplied) {
      state.discountApplied = true;
      state.discountMessage = 'Discount applied: You get a 10% discount!';
    }
  } else {
    if (state.discountApplied) {
      state.discountApplied = false;
      state.discountMessage = 'Add more items to your cart to receive a discount!';
    }
  }
};

export const { addToCart, updateQuantity, removeFromCart, clearCart, applyDiscount, removeDiscount } = cartSlice.actions;
export default cartSlice.reducer;
