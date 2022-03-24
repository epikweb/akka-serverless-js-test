
import akkaserverless from "@lightbend/akkaserverless-javascript-sdk";
const EventSourcedEntity = akkaserverless.EventSourcedEntity;

const entity = new EventSourcedEntity(
  [
    "cart_api.proto",
    "cart_domain.proto"
  ],
  "com.example_2.ShoppingCartService",
  "eventsourced-shopping-cart",
  {
    includeDirs: ["./proto"],
    persistenceId: "shopping-cart",
    snapshotEvery: 100
  }
);
entity.initial = entityId => Cart.create({ items: [] });

const pkg = "com.example_2.domain.";
const ItemAdded = entity.lookupType(pkg + "ItemAdded");
const ItemRemoved = entity.lookupType(pkg + "ItemRemoved");
const Cart = entity.lookupType(pkg + "Cart");

entity.setInitial(cartId => Cart.create({items: []}));
entity.setBehavior(cart => {
  return {
    commandHandlers: {
      AddItem: addItem,
      RemoveItem: removeItem,
      GetCart: getCart
    },
    eventHandlers: {
      ItemAdded: itemAdded,
      ItemRemoved: itemRemoved
    }
  };
});

function addItem(addItem, cart, ctx) {
  if (addItem.quantity < 1) {
    ctx.fail("Quantity for item " + addItem.productId + " must be greater than zero.");
  } else {
    const itemAdded = ItemAdded.create({
      item: {
        productId: addItem.productId,
        name: addItem.name,
        quantity: addItem.quantity
      }
    });
    ctx.emit(itemAdded);
    return {};
  }
}

function removeItem(removeItem, cart, ctx) {
  const existing = cart.items.find(item => {
    return item.productId === removeItem.productId;
  });

  if (!existing) {
    ctx.fail("Item " + removeItem.productId + " not in cart");
  } else {
    const itemRemoved = ItemRemoved.create({
      productId: removeItem.productId
    });
    ctx.emit(itemRemoved);
    return {};
  }
}

function getCart(request, cart) {
  return cart;
}
function itemAdded(added, cart) {
  const existing = cart.items.find(item => {
    return item.productId === added.item.productId;
  });

  if (existing) {
    existing.quantity = existing.quantity + added.item.quantity;
  } else {
    cart.items.push(added.item);
  }

  return cart;
}

function itemRemoved(removed, cart) {
  cart.items = cart.items.filter(item => {
    return item.productId !== removed.productId;
  });

  return cart;
}

export default entity