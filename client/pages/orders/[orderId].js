import Router from "next/router";
import useRequest from "../../hooks/use-request";
import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";

function OrderShow({ order, currentUser }) {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: { orderId: order.id },
    onSuccess: (payment) => {
      Router.push("/orders");
    },
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };
    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order.expiresAt]);

  if (timeLeft < 0) return <div>Order expired</div>;
  return (
    <div>
      <span>Time left to pay: {timeLeft} seconds </span>
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_51OCRjXGXi6WKrwPkoLJ6e5VvcdbvP5SYfBXkrfhJKAXE5fEJboMR2KOCJIaHlbmu8qPdvzFUuROpPH1FCMXS6nIr00VzeuwnsZ"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
    </div>
  );
}

OrderShow.getInitialProps = async (context, client, currentUser) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data };
};

export default OrderShow;
