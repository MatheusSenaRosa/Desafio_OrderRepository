import EventDispatcher from "../../@shared/event/event-dispatcher";
import CustomerFactory from "../factory/customer.factory";
import Address from "../value-object/address";
import AddressChangedEvent from "./address-changed-event";
import EnviaConsoleLogHandler from "./handler/envia-console-log.handler";

describe("Address changed events", () => {
  it("Should dispatch events when user address is changed", () => {
    const address = new Address("street", 100, "zip", "city");
    const customer = CustomerFactory.createWithAddress("John", address);

    const newAddress = new Address("newStreet", 200, "newZip", "newCity");

    customer.changeAddress(newAddress);

    const eventDispatcher = new EventDispatcher();
    const addressChangedEvent = new AddressChangedEvent(customer);

    const enviaConsoleLogHandler = new EnviaConsoleLogHandler();
    const spyEventHandler = jest.spyOn(enviaConsoleLogHandler, "handle");

    eventDispatcher.register("AddressChangedEvent", enviaConsoleLogHandler);
    eventDispatcher.notify(addressChangedEvent);

    expect(spyEventHandler).toHaveBeenCalled();
  });
});
