import { Sequelize } from "sequelize-typescript";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import ProductModel from "../../../product/repository/sequelize/product.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();

    const customerRepository = new CustomerRepository();
    const customer = new Customer("1", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const productRepository = new ProductRepository();
    const product = new Product("1", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("1", "1", [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const foundOrder = await orderRepository.find(order.id);

    expect(foundOrder).toStrictEqual(order);
  });

  it("should update an order", async () => {
    const productRepository = new ProductRepository();
    const orderRepository = new OrderRepository();

    const product = new Product("1", "Product 1", 10);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );
    const order = new Order("1", "1", [orderItem]);

    await productRepository.create(product);
    await orderRepository.create(order);

    const updatedOrderItem = new OrderItem(
      order.id,
      product.name,
      product.price,
      product.id,
      20
    );
    const updatedOrder = new Order("1", "1", [updatedOrderItem]);

    await orderRepository.update(updatedOrder);
    const foundOrder = await orderRepository.find(order.id);

    expect(foundOrder).toStrictEqual(updatedOrder);
  });

  it("should find an order", async () => {
    const orderRepository = new OrderRepository();
    const productRepository = new ProductRepository();

    const product = new Product("1", "Product 1", 10);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );
    const order = new Order("1", "1", [orderItem]);

    await productRepository.create(product);
    await orderRepository.create(order);

    const foundOrder = await orderRepository.find(order.id);

    expect(foundOrder).toStrictEqual(order);
  });

  it("should find all orders", async () => {
    const orderRepository = new OrderRepository();
    const productRepository = new ProductRepository();

    const product1 = new Product("1", "Product 1", 10);
    const product2 = new Product("2", "Product 2", 20);

    const orderItem1 = new OrderItem(
      "1",
      product1.name,
      product1.price,
      product1.id,
      1
    );

    const orderItem2 = new OrderItem(
      "2",
      product2.name,
      product2.price,
      product2.id,
      2
    );

    const order1 = new Order("1", "1", [orderItem1]);
    const order2 = new Order("2", "1", [orderItem2]);

    await productRepository.create(product1);
    await productRepository.create(product2);
    await orderRepository.create(order1);
    await orderRepository.create(order2);

    const foundOrder = await orderRepository.findAll();

    expect(foundOrder).toStrictEqual([order1, order2]);
  });
});
