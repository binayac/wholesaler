import { useState, useEffect } from "react"
import { getBaseUrl } from "../utils/baseURL"


const PaymentSuccess = () => {
    const [order, setOrder] = useState(null);
    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const sessionId = query.get('session_id');
        
        
        if(sessionId) {
            fetch(`${getBaseUrl()}/api/orders/confirm-payment`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({session_id: sessionId})
            })
            .then((res) => res.json())
            .then((data) => setOrder(data.order))
            .catch((err) => console.error("Error confirming payment", err))
        }
        console.log(order)
    }, [])
    


  return (
    <div>PaymentSuccess</div>
  )
}

export default PaymentSuccess