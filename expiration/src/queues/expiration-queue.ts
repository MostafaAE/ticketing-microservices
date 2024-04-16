import Queue from "bull";
import { ExpirationCompletePublisher } from "../events/publishers/expiration-complete-publisher";
import { natsWrapper } from "../nats-wrapper";

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>("order:expiration", {
  redis: {
    host: "expiration-redis-srv",
  },
});

expirationQueue.process(async (job) => {
  await new ExpirationCompletePublisher(natsWrapper.client).publish({
    id: job.data.orderId,
  });
  //   console.log(
  //     "I want to publish an expiration:complete event for orderId",
  //     job.data.orderId
  //   );
});

export { expirationQueue };
