import { useState } from 'react';
import { Check, Clock, ChevronDown, MessageSquare, Calendar } from 'lucide-react';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { useSelector } from "react-redux";

export default function Checkout() {
  const [isNewCustomer, setIsNewCustomer] = useState(true);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [deliveryOption, setDeliveryOption] = useState('delivery');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [value, setValue] = useState()

  const cartItems = useSelector(state => state.cart.cartItems ||[]);
  
  // Generate dates for the next 14 days
  const getNextTwoWeeks = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };
  
  const availableDates = getNextTwoWeeks();
  
  // Generate time slots
  const timeSlots = [
    '9:00 AM - 12:00 PM',
    '12:00 PM - 3:00 PM',
    '3:00 PM - 6:00 PM',
    '6:00 PM - 9:00 PM'
  ];
  


  const subtotal = cartItems.reduce((sum, item) => sum + item.amount * item.quantity, 0);
  const shipping = shippingMethod === 'standard' ? 0 : 10.50;
  const discount = 0;
  const total = subtotal + shipping - discount;

  const formatDate = (date) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(formatDate(date));
    setShowDatePicker(false);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setShowTimePicker(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 font-sans">
      <h1 className="text-2xl font-bold text-blue-900 mb-8">CHECKOUT</h1>
      
      {/* Progress indicator */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center">
          <div className="bg-blue-900 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-1">
            1
          </div>
          <span className="text-sm mr-8">SHOPPING CART</span>
          
          <div className="bg-blue-900 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-1">
            2
          </div>
          <span className="text-sm font-bold mr-8">CHECKOUT</span>
          
          <div className="bg-gray-200 text-gray-500 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-1">
            3
          </div>
          <span className="text-sm text-gray-500">PAYMENT</span>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left column - Forms */}
        <div className="w-full lg:w-3/5 space-y-6">
          {/* Contact Information */}
          <div className="border border-gray-200 p-6 rounded">
            <h2 className="text-base font-bold text-blue-900 mb-6">CONTACT INFORMATION</h2>
            
            <div className="flex gap-4 mb-6">
              <label className="flex items-center">
                <input 
                  type="radio" 
                  checked={isNewCustomer} 
                  onChange={() => setIsNewCustomer(true)}
                  className="mr-2" 
                />
                <span className="text-sm">I'm a new customer</span>
              </label>
              
              <label className="flex items-center">
                <input 
                  type="radio" 
                  checked={!isNewCustomer} 
                  onChange={() => setIsNewCustomer(false)}
                  className="mr-2" 
                />
                <span className="text-sm">I'm a regular customer</span>
              </label>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  placeholder="Enter your full name" 
                  className="w-full border border-gray-300 p-2 rounded text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="w-full border border-gray-300 p-2 rounded text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                <PhoneInput
                placeholder="Enter phone number"
                defaultCountry="US"
                value={value}
                onChange={setValue}
                className='w-full border border-gray-300 p-2 rounded text-sm'
    />
                </div>
              </div>
            </div>
          </div>
          
          {/* Shipping Details */}
          <div className="border border-gray-200 p-6 rounded">
            <h2 className="text-base font-bold text-blue-900 mb-6">SHIPPING DETAILS</h2>
            
            <div className="flex gap-4 mb-6">
              <label className="flex items-center">
                <input 
                  type="radio" 
                  checked={deliveryOption === 'self-pickup'} 
                  onChange={() => setDeliveryOption('self-pickup')}
                  className="mr-2" 
                />
                <span className="text-sm">Self-Pickup</span>
              </label>
              
              <label className="flex items-center">
                <input 
                  type="radio" 
                  checked={deliveryOption === 'delivery'} 
                  onChange={() => setDeliveryOption('delivery')}
                  className="mr-2" 
                />
                <span className="text-sm">Delivery</span>
              </label>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">
                  Country <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select className="w-full appearance-none border border-gray-300 p-2 rounded text-sm pr-8">
                    <option>Select a country</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-500" />
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select className="w-full appearance-none border border-gray-300 p-2 rounded text-sm pr-8">
                      <option>Select a city</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-500" />
                  </div>
                </div>
                
                <div className="w-1/2">
                  <label className="block text-sm mb-1">
                    Region <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select className="w-full appearance-none border border-gray-300 p-2 rounded text-sm pr-8">
                      <option>Select a region</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-500" />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm mb-1">
                  ZIP Code <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  placeholder="Enter a ZIP code" 
                  className="w-full border border-gray-300 p-2 rounded text-sm"
                />
              </div>
              
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm mb-1">
                    Street Name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="Enter a street name" 
                    className="w-full border border-gray-300 p-2 rounded text-sm"
                  />
                </div>
                
                <div className="w-1/2">
                  <label className="block text-sm mb-1">
                    House Number <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="Enter a house number" 
                    className="w-full border border-gray-300 p-2 rounded text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Shipping Method */}
          <div className="border border-gray-200 p-6 rounded">
            <h2 className="text-base font-bold text-blue-900 mb-6">SHIPPING METHOD</h2>
            
            <div className="space-y-4">
              <label className="flex justify-between border border-gray-200 p-3 rounded cursor-pointer hover:border-blue-500">
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    checked={shippingMethod === 'standard'} 
                    onChange={() => setShippingMethod('standard')}
                    className="mr-3" 
                  />
                  <div>
                    <p className="text-sm font-medium">Standard Shipping</p>
                    <p className="text-xs text-gray-500">5-7 business days</p>
                  </div>
                </div>
                <span className="font-medium">$0.00</span>
              </label>
              
              <label className="flex justify-between border border-gray-200 p-3 rounded cursor-pointer hover:border-blue-500">
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    checked={shippingMethod === 'express'} 
                    onChange={() => setShippingMethod('express')}
                    className="mr-3" 
                  />
                  <div>
                    <p className="text-sm font-medium">Express Shipping</p>
                    <p className="text-xs text-gray-500">1-3 business days</p>
                  </div>
                </div>
                <span className="font-medium">$10.50</span>
              </label>
            </div>
            
            <div className="mt-4 space-y-4">
              <div className="relative">
                <label className="block text-sm mb-1">Shipping Date</label>
                <div 
                  className="w-full border border-gray-300 p-2 rounded text-sm flex justify-between items-center cursor-pointer"
                  onClick={() => setShowDatePicker(!showDatePicker)}
                >
                  <span>{selectedDate || 'Select a suitable shipping date'}</span>
                  <Calendar size={16} className="text-gray-500" />
                </div>
                
                {/* Date Picker */}
                {showDatePicker && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded shadow-lg">
                    <div className="p-2 bg-blue-50 border-b border-gray-200">
                      <h3 className="text-sm font-medium">Select Delivery Date</h3>
                    </div>
                    <div className="p-2 max-h-64 overflow-y-auto">
                      {availableDates.map((date, index) => (
                        <div 
                          key={index}
                          className={`p-2 text-sm cursor-pointer hover:bg-blue-50 ${selectedDate === formatDate(date) ? 'bg-blue-100' : ''}`}
                          onClick={() => handleDateSelect(date)}
                        >
                          {formatDate(date)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="relative">
                <label className="block text-sm mb-1">Shipping Time</label>
                <div 
                  className="w-full border border-gray-300 p-2 rounded text-sm flex justify-between items-center cursor-pointer"
                  onClick={() => setShowTimePicker(!showTimePicker)}
                >
                  <span>{selectedTime || 'Select a suitable shipping time'}</span>
                  <Clock size={16} className="text-gray-500" />
                </div>
                
                {/* Time Picker */}
                {showTimePicker && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded shadow-lg">
                    <div className="p-2 bg-blue-50 border-b border-gray-200">
                      <h3 className="text-sm font-medium">Select Delivery Time</h3>
                    </div>
                    <div className="p-2">
                      {timeSlots.map((time, index) => (
                        <div 
                          key={index}
                          className={`p-2 text-sm cursor-pointer hover:bg-blue-50 ${selectedTime === time ? 'bg-blue-100' : ''}`}
                          onClick={() => handleTimeSelect(time)}
                        >
                          {time}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Right column - Cart */}
        <div className="w-full lg:w-2/5">
          <div className="border border-gray-200 p-6 rounded">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-base font-bold text-blue-900">SHOPPING CART <span className="text-gray-500 font-normal">({cartItems.length} items)</span></h2>
              <button className="text-blue-500 text-sm">EDIT</button>
            </div>
            
            <div className="space-y-6 mb-6">
              {cartItems.map(item => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center">
                    <img src={item.image} alt={item.name} className="max-w-full max-h-full" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{item.name}</h3>
                    <p className="text-xs text-gray-500">{item.description}</p>
                    <p className="text-xs text-gray-500">{item.color}</p>
                    <div className="flex justify-between mt-2">
                      <span className="text-xs">x{item.quantity}</span>
                      <span className="font-medium">${item.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex mb-2">
                <input 
                  type="text" 
                  placeholder="Enter a discount code" 
                  className="flex-1 border border-gray-300 p-2 rounded-l text-sm"
                />
                <button className="bg-white border border-gray-300 border-l-0 rounded-r px-4 text-sm">APPLY</button>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>SUBTOTAL</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>SHIPPING</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>DISCOUNT</span>
                <span>${discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200 mt-2">
                <span>TOTAL</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            
            <button className="w-full bg-blue-900 text-white py-3 rounded mt-6 font-medium hover:bg-blue-800 transition-colors">
              PROCEED TO PAYMENT
            </button>
            
            <div className="flex items-center text-sm text-blue-500 mt-4">
              <div className="rounded-full bg-blue-900 text-white w-5 h-5 flex items-center justify-center mr-2">
                <MessageSquare size={12} />
              </div>
              ADD A COMMENT
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}