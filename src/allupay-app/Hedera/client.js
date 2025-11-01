import { Client, AccountId, PrivateKey } from "@hashgraph/sdk";

// Grab your Hedera testnet account ID and private key from your .env file
const myAccountId = import.meta.env.VITE_MY_ACCOUNT_ID;
const myPrivateKey = import.meta.env.VITE_MY_PRIVATE_KEY;

// If we weren't able to grab it, we'll throw a new error
if (myAccountId == null || myPrivateKey == null) {
  throw new Error(
    "Environment variables VITE_MY_ACCOUNT_ID and VITE_MY_PRIVATE_KEY must be present"
  );
}

// Create our connection to the Hedera network
// The Hedera JS SDK makes this really easy!
const client = Client.forTestnet();

client.setOperator(myAccountId, myPrivateKey);

export function getClient() {
    return client;
}

export function getAccountId() {
    return AccountId.fromString(myAccountId);
}

export default client;
