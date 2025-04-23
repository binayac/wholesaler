import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  selectedItems: 0,
  totalPrice: 0,
  subtotalAfterDiscount: 0,
  discountAmount: 0,
  tax: 0,
  taxRate: 0.05,
  grandTotal: 0,
  userRole: 'regular',
  discountApplied: false,
  discountMessage: '',
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, userRole } = action.payload;
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
      }
      
      updateCartTotals(state);
      checkForDiscounts(state); // Call directly without dispatch
    },

    updateQuantity: (state, action) => {
      const { id, type } = action.payload;
      const productToUpdate = state.products.find(product => 
        (product.id === id) || (product._id === id)
      );
      
      if (productToUpdate) {
        if (type === "increment") {
          productToUpdate.quantity += 1;
        } else if (type === "decrement" && productToUpdate.quantity > 1) {
          productToUpdate.quantity -= 1;
        }
      }

      updateCartTotals(state);
      checkForDiscounts(state); // Call directly without dispatch
    },
    
    removeFromCart: (state, action) => {
      const id = action.payload;
      state.products = state.products.filter(product => 
        (product.id !== id) && (product._id !== id)
      );
      updateCartTotals(state);
      checkForDiscounts(state); // Call directly without dispatch
    },
    
    clearCart: (state) => {
      state.products = [];
      updateCartTotals(state);
      // Reset discount when cart is cleared
      state.discountApplied = false;
      state.discountMessage = '';
      state.discountAmount = 0;
    },
    
    applyDiscount: (state, action) => {
      const { discountRate, message } = action.payload;
      state.discountApplied = true;
      state.discountMessage = message;
      state.discountAmount = state.totalPrice * discountRate;
      updateCartTotals(state);
    },
    
    removeDiscount: (state) => {
      state.discountApplied = false;
      state.discountMessage = '';
      state.discountAmount = 0;
      updateCartTotals(state);
    }
  },
});

// Helper function to update all cart totals
const updateCartTotals = (state) => {
  state.selectedItems = calculateSelectedItems(state);
  state.totalPrice = calculateTotalPrice(state);
  
  // Apply discount if applicable
  state.subtotalAfterDiscount = state.discountApplied 
    ? state.totalPrice - state.discountAmount 
    : state.totalPrice;
  
  state.tax = calculateTax(state);
  state.grandTotal = calculateGrandTotal(state);
};

// Check for applicable discounts
const checkForDiscounts = (state) => {
  // Check for wholesaler spending threshold
  if (state.userRole === 'wholesaler' && state.totalPrice >= 100) {
    // Apply discount directly instead of dispatching
    state.discountApplied = true;
    state.discountMessage = '10% discount applied for wholesalers!';
    state.discountAmount = state.totalPrice * 0.1;
  } else if (state.discountApplied) {
    // Remove discount directly
    state.discountApplied = false;
    state.discountMessage = '';
    state.discountAmount = 0;
  }
  
  // Update totals after changing discount
  updateCartTotals(state);
};

// Utility functions
const calculateSelectedItems = (state) =>
  state.products.reduce((total, product) => total + product.quantity, 0);

const calculateTotalPrice = (state) =>
  state.products.reduce((total, product) => {
    const price = state.userRole === 'wholesaler' && product.wholesalerPrice
      ? product.wholesalerPrice
      : product.price;
    return total + product.quantity * price;
  }, 0);

const calculateTax = (state) => state.subtotalAfterDiscount * state.taxRate;

const calculateGrandTotal = (state) => state.subtotalAfterDiscount + state.tax;

export const { 
  addToCart, 
  updateQuantity, 
  removeFromCart, 
  clearCart, 
  applyDiscount, 
  removeDiscount 
} = cartSlice.actions;

export default cartSlice.reducer;