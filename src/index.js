import { AkkaServerless } from "@lightbend/akkaserverless-javascript-sdk";
import cart from './cart.js'
import cartJournalReactor from './cart-journal-reactor.js'
import counter from './counter.js'


new AkkaServerless()
  .addComponent(cart)
  .addComponent(cartJournalReactor)
  .addComponent(counter)
  .start();