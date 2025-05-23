import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetOrderByIdQuery } from "../../../redux/features/orders/orderApi";
import TimelineStep from "../../../components/TimelineStep";

const OrderDetails = () => {
  const { orderId } = useParams();
  const { data: order, isLoading, error } = useGetOrderByIdQuery(orderId);
  const [copied, setCopied] = useState(false);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load order.</p>;

  if (!order) {
    return <p>No order found.</p>;
  }

  const items = order?.products || [];
  const totalAmount = items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);

  // Check if the order status is completed
  const isCompleted = (status) => {
    const statuses = ["pending", "processing", "shipped", "completed"];
    return statuses.indexOf(status) < statuses.indexOf(order.status);
  };

  const isCurrent = (status) => order.status === status;

  const steps = [
    {
      status: 'pending',
      label: 'Pending',
      description: 'Your order has been created and is awaiting processing.',
      icon: { iconName: 'time-line', bgColor: 'red-500', textColor: 'gray-800' },
    },
    {
      status: 'processing',
      label: 'Processing',
      description: 'Your order is currently being processed.',
      icon: { iconName: 'loader-line', bgColor: 'bg-yellow-800', textColor: 'yellow-800' },
    },
    {
      status: 'shipped',
      label: 'Shipped',
      description: 'Your order has been shipped.',
      icon: { iconName: 'truck-line', bgColor: 'blue-800', textColor: 'blue-800' },
    },
    {
      status: 'completed',
      label: 'Completed',
      description: 'Your order has been successfully completed.',
      icon: { iconName: 'check-line', bgColor: 'green-800', textColor: 'green-900' },
    },
  ];

  const copyTrackingNumber = () => {
    if (order?.trackingNumber) {
      navigator.clipboard.writeText(order.trackingNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section className="content__container rounded p-6">
      {/* Order Details Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Order Detail</h1>
        <div className="flex items-center gap-2">
          <span className="text-gray-700 font-medium">#{order?._id}</span>
          <span className="bg-green-100 text-green-600 px-2 py-1 rounded-md text-xs font-medium">{order?.status}</span>
        </div>
      </div>

      {/* Order Items */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Items</h2>
          <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">{items.length}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => (
            <div key={item._id} className="flex bg-gray-50 p-4 rounded-lg">
              <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden mr-4">
                <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{item.name}</div>
                <div className="text-sm font-semibold mt-1">$ {item.price?.toLocaleString() || 'N/A'}</div>
                <div className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="border-t pt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Order Summary</h2>
          <span className="bg-green-100 text-green-600 px-2 py-1 rounded-md text-xs font-medium">{order?.paymentStatus}</span>
        </div>
        <div className="text-sm text-gray-500 mb-4">Here's your summary for the stuff you bought.</div>

        <div className="space-y-2 mb-4">
          {items.map((item) => (
            <div key={item._id} className="flex justify-between">
              <span className="text-sm">{item.name}</span>
              <span className="text-sm font-medium">$ {(item.price * item.quantity).toLocaleString() || 'N/A'}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between pt-4 border-t">
          <span className="font-semibold">Total</span>
          <span className="font-semibold">$ {totalAmount.toLocaleString() || '0'}</span>
        </div>

        <div className="flex justify-between items-center mt-8">
          <div className="text-sm text-gray-700">
            <span className="font-semibold">$ {totalAmount.toLocaleString() || '0'}</span>
            <span className="text-gray-500 ml-1">({items.length} Items)</span>
          </div>
          <div className="flex space-x-3">
            <button className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium">Invoice</button>
          </div>
        </div>
      </div>

      {/* Order Timeline */}
      <div className='w-full'>
        <h2 className="text-2xl font-semibold mt-8 pt-8 mb-4 border-t">Order Status</h2>
        <ol className="sm:flex items-start relative">
          {steps.map((step, index) => (
            <TimelineStep
              key={index}
              step={step}
              order={order}
              isCompleted={isCompleted(step.status)}
              isCurrent={isCurrent(step.status)}
              isLastStep={index === steps.length - 1}
              icon={step.icon}
              description={step.description}
            />
          ))}
        </ol>
      </div>
    </section>
  );
};

export default OrderDetails;
