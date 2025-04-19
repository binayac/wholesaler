import { useState } from 'react';
import { Clock, PackageCheck, MapPin, Copy, Truck } from 'lucide-react';

const ViewOrdersNew = () =>  {
  const [copied, setCopied] = useState(false);
  
  const copyTrackingNumber = () => {
    navigator.clipboard.writeText('8712/1893812');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full mx-auto bg-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Order Detail</h1>
        <div className="flex items-center gap-2">
          <span className="text-gray-700 font-medium">#8981786</span>
          <span className="bg-green-100 text-green-600 px-2 py-1 rounded-md text-xs font-medium">On Delivery</span>
        </div>
      </div>

      {/* Delivery Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Truck className="h-5 w-5 text-gray-600 mr-2" />
            <span className="text-sm text-gray-700">Be patient, package on delivery!</span>
          </div>
          <div className="flex items-center mb-3">
            <div className="flex items-center mr-6">
              <MapPin className="h-4 w-4 text-gray-500 mr-1" />
              <span className="text-xs text-gray-600">Kathmandu, Nepal</span>
            </div>
            <div className="text-xs text-gray-400">• • • • • • • • • • •</div>
            <div className="flex items-center ml-6">
              <MapPin className="h-4 w-4 text-gray-500 mr-1" />
              <span className="text-xs text-gray-600">John's House, Nepal</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-orange-500 h-2 rounded-full w-3/4"></div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Clock className="h-5 w-5 text-gray-600 mr-2" />
          </div>
          <div className="text-xs text-gray-500 mb-1">Estimated Arrival</div>
          <div className="text-lg font-semibold">9 July 2024</div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <PackageCheck className="h-5 w-5 text-gray-600 mr-2" />
          </div>
          <div className="text-xs text-gray-500 mb-1">Delivered in</div>
          <div className="text-lg font-semibold">5 Days</div>
        </div>
      </div>

      {/* Timeline and Shipment Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h2 className="text-sm text-gray-500 mb-4">Timeline</h2>
          <div className="space-y-4">
            <div className="flex">
              <div className="w-20">
                <div className="text-xs font-medium">4 Jul (Now)</div>
                <div className="text-xs text-gray-500">06:00</div>
              </div>
              <div className="ml-4 pb-6 border-l-2 border-blue-500 pl-4">
                <div className="font-medium text-sm">Your package is packed by the courier</div>
                <div className="text-xs text-gray-500">Malang, East Java, Indonesia</div>
              </div>
            </div>

            <div className="flex">
              <div className="w-20">
                <div className="text-xs font-medium">2 Jul</div>
                <div className="text-xs text-gray-500">06:00</div>
              </div>
              <div className="ml-4 pb-6 border-l-2 border-gray-200 pl-4">
                <div className="font-medium text-sm">Shipment has been created</div>
                <div className="text-xs text-gray-500">Malang, Indonesia</div>
              </div>
            </div>

            <div className="flex">
              <div className="w-20">
                <div className="text-xs font-medium">1 Jul</div>
                <div className="text-xs text-gray-500">08:00</div>
              </div>
              <div className="ml-4 pl-4">
                <div className="font-medium text-sm">Order placed</div>
                <div className="flex items-center mt-2">
                  <div className="h-6 w-6 bg-blue-600 rounded-full text-white flex items-center justify-center text-xs font-bold mr-2">N</div>
                  <span className="text-sm">Nike</span>
                  <div className="ml-2 h-3 w-3 bg-blue-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-sm text-gray-500 mb-4">Shipment</h2>
          <div className="flex items-center mb-4">
            <div className="mr-4">
              <Truck className="h-8 w-8 text-red-500" />
            </div>
            <div>
              <div className="font-medium">Pathao Nepal</div>
              <div className="text-xs text-gray-500">Baneshwor, Kathmandu, Nepal</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-xs text-gray-500 mb-1">Recipient</div>
              <div className="font-medium">Anil</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Delivery address</div>
              <div className="font-medium">Tinkune, Kathmandu, Nepal</div>
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-1">Tracking No.</div>
            <div className="flex items-center">
              <span className="font-medium mr-2">8712/1893812</span>
              <button 
                onClick={copyTrackingNumber}
                className="text-gray-400 hover:text-gray-600"
              >
                <Copy className="h-4 w-4" />
              </button>
              {copied && <span className="text-xs text-green-500 ml-2">Copied!</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Items</h2>
          <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">4</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Item 1 */}
          <div className="flex bg-gray-50 p-4 rounded-lg">
            <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden mr-4">
              <img src="/api/placeholder/80/80" alt="Nike Air Max SYSTM" className="object-cover" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">Nike Air Max SYSTM</div>
              <div className="text-sm font-semibold mt-1">Rs 4,499</div>
              <div className="text-xs text-gray-500 mt-1">Size: 24</div>
            </div>
          </div>

          {/* Item 2 */}
          <div className="flex bg-gray-50 p-4 rounded-lg">
            <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden mr-4">
              <img src="/api/placeholder/80/80" alt="Nike Air Rift" className="object-cover" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">Nike Air Rift</div>
              <div className="text-sm font-semibold mt-1">Rs 4,909</div>
              <div className="text-xs text-gray-500 mt-1">Size: 24</div>
            </div>
          </div>

          {/* Item 3 */}
          <div className="flex bg-gray-50 p-4 rounded-lg">
            <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden mr-4">
              <img src="/api/placeholder/80/80" alt="Nike Air Max Pulse" className="object-cover" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">Nike Air Max Pulse</div>
              <div className="text-sm font-semibold mt-1">Rs 5,379</div>
              <div className="text-xs text-gray-500 mt-1">Size: 24</div>
            </div>
          </div>

          {/* Item 4 */}
          <div className="flex bg-gray-50 p-4 rounded-lg">
            <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden mr-4">
              <img src="/api/placeholder/80/80" alt="Nike Air Max Air" className="object-cover" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">Nike Air Max Air</div>
              <div className="text-sm font-semibold mt-1">Rs 5,279</div>
              <div className="text-xs text-gray-500 mt-1">Size: 24</div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="border-t pt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Order Summary</h2>
          <span className="bg-green-100 text-green-600 px-2 py-1 rounded-md text-xs font-medium">Payment Success</span>
        </div>
        <div className="text-sm text-gray-500 mb-4">Here's your summary for the stuff you bought.</div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span className="text-sm">Nike Air Max SYSTM</span>
            <span className="text-sm font-medium">Rs 4,499</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Nike Air Max Pulse</span>
            <span className="text-sm font-medium">Rs 5,379</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Nike Air Rift</span>
            <span className="text-sm font-medium">Rs 4,909</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Nike Air Max Air</span>
            <span className="text-sm font-medium">Rs 5,279</span>
          </div>
        </div>

        <div className="flex justify-between pt-4 border-t">
          <span className="font-semibold">Total</span>
          <span className="font-semibold">Rs 20,066</span>
        </div>

        <div className="flex justify-between items-center mt-8">
          <div className="text-sm text-gray-700">
            <span className="font-semibold">Rs 20,066</span>
            <span className="text-gray-500 ml-1">(4 Items)</span>
          </div>
          <div className="flex space-x-3">
            <button className="text-sm font-medium">Contact Seller</button>
            <button className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium">Invoice</button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ViewOrdersNew