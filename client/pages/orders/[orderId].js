import { useEffect, useState} from "react";
import PropTypes from 'prop-types';
import Router from "next/router"
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/use-request";
 

const orderShow = ({order, currentUser}) => {
    const [timeLeft, setTimeLeft] = useState(0);
    const { doRequest, errors} = useRequest({
        url: "/api/payments",
        method: "post",
        body: {
            orderId: order.id
        },
        onSuccess: () => Router.push("/orders")
    });


    useEffect(() =>{
        console.log("order data:", order);
        const findTimeLeft = () => {
            const msLeft = new Date(order.expiresAt) - new Date();
            setTimeLeft(Math.round(msLeft / 1000));
    
        }

        findTimeLeft();
        const timerId = setInterval(findTimeLeft, 1000);

        return () =>{
            clearInterval(timerId);
        };

    }, [order]); 

    if (timeLeft < 0) {
        return <div>Order Expired</div>
    }

   return (
     <div>
        Time left to pay: {timeLeft } seconds
         <StripeCheckout
            token={({ id }) => doRequest({ token: id })}
            stripeKey="pk_test_51MlpHBKZwbqzMIkX7U40cTteFxxkCnS5ErGIo8sqTkuBG7nQtYqblyZn9fRdsLPD2gWCayoOgS1VnD1LXogQWvjF00Vjj39TYS"
            amount={order.ticket.price * 100}
            email={currentUser.email}
        />
        {errors}
    </div>
    );
};


orderShow.getInitialProps = async (context, client) => {
    const { orderId } = context.query;
    const { data } = await client.get(`/api/orders/${orderId}`);

    return { order: data};
};

export default orderShow;