import EventDispatcher from "../../@shared/event/event-dispatcher";
import CustomerFactory from "../factory/customer.factory";
import CustomerCreatedEvent from "./customer-created.event";
import EnviaConsoleLog1Handler from "./handler/envia-console-log-1.handler";
import EnviaConsoleLog2Handler from "./handler/envia-console-log-2.handler";

describe("Customer created events", () => {
  it("Should dispatch events when user is created", () => {
    const customer = CustomerFactory.create("John");

    const eventDispatcher = new EventDispatcher();
    const customerCreatedEvent = new CustomerCreatedEvent(customer);

    const enviaConsoleLog1Handler = new EnviaConsoleLog1Handler();
    const enviaConsoleLog2Handler = new EnviaConsoleLog2Handler();
    const spyEventHandler1 = jest.spyOn(enviaConsoleLog1Handler, "handle");
    const spyEventHandler2 = jest.spyOn(enviaConsoleLog2Handler, "handle");

    eventDispatcher.register("CustomerCreatedEvent", enviaConsoleLog1Handler);
    eventDispatcher.register("CustomerCreatedEvent", enviaConsoleLog2Handler);

    eventDispatcher.notify(customerCreatedEvent);

    expect(spyEventHandler1).toHaveBeenCalled();
    expect(spyEventHandler2).toHaveBeenCalled();
  });
});
