import { View } from "@lightbend/akkaserverless-javascript-sdk"

const view = new View(
  [
    "cart_api.proto",
    "cart_domain.proto"
  ],
  "com.example_2.ShoppingCartReactionService",
  {
    includeDirs: ["./proto"],
  }
);
const GetQuantitiesByProductState = view.lookupType("com.example_2.GetQuantitiesByProductState")
view.setUpdateHandlers({
  ForwardAdded: (event, state) => {
    console.log('two called with', event, state)

    const props = { productId: event.item.productId, totalQuantity: event.item.quantity }
    const initialState = GetQuantitiesByProductState.create(props)
    console.log('init with', { props, initialState })
    return initialState
  }
})

export default view