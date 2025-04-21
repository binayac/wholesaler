import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  products: [],
  selectedItems: 0,
  totalPrice: 0,
  tax: 0,
  taxRate: 0.05,
  grandTotal: 0
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      // Check if using _id or id for consistency
      const productId = action.payload._id || action.payload.id;
      const isExist = state.products.find((product) => 
        (product._id === productId) || (product.id === productId)
      );
      
      if (!isExist) {
        // Store both id and _id to prevent inconsistencies
        state.products.push({
          ...action.payload, 
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
    },
    
    clearCart: (state) => {
      state.products = [];
      state.selectedItems = 0;
      state.totalPrice = 0;
      state.tax = 0;
      state.grandTotal = 0;
    }
  },
});

// Utility functions
export const setSelectedItems = (state) => state.products.reduce((total, product) => {
  return Number(total + product.quantity);
}, 0);

export const setTotalPrice = (state) => state.products.reduce((total, product) => {
  return Number(total + product.quantity * product.price);
}, 0);

export const setTax = (state) => setTotalPrice(state) * state.taxRate;

export const setGrandTotal = (state) => {
  return setTotalPrice(state) + setTotalPrice(state) * state.taxRate;
};

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;