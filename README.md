# Allupay - A Sleek Web3 Wallet

**Hackathon Track:** Onchain Finance (Crypto/Web3)

## 1. Project Description

Allupay is a unified, multi-currency Web3 wallet designed to simplify payments across Africa. It addresses the high friction and costs associated with cross-border transactions by integrating traditional finance (Bank Transfers), mobile money (Momo), and cryptocurrency into a single, intuitive interface.

## 2. Hedera Integration Summary

Allupay leverages the Hedera network for its cryptocurrency transfer functionality, providing users with fast, low-cost, and secure HBAR transactions.

### Hedera Service Used
*   **Hedera Token Service (HTS):** Used for all native cryptocurrency (HBAR) transfers within the wallet.

Follow these steps to run the Allupay project locally on the Hedera Testnet.

### Prerequisites

*   Node.js (v18 or later)
*   npm or yarn
*   A Hedera Testnet account. You can get one for free at portal.hedera.com.

### Setup Steps

1.  **Clone the repository:**
    ```bash
    # Clone the repository you just created on GitHub
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root of the project by copying the example file:
    ```bash
    cp .env.example .env
    ```
    Open the `.env` file and add your Hedera Testnet Account ID and Private Key:
    ```
    VITE_MY_ACCOUNT_ID=[Your Testnet Account ID]
    VITE_MY_PRIVATE_KEY=[Your Testnet Private Key]
    VITE_TREASURY_ACCOUNT_ID=[A DIFFERENT Testnet Account ID to receive payments]
    ```

4.  **Run the project:**
    ```bash
    npm run dev
    ```
### Running Environment

*   The React frontend will be available at `http://localhost:5173`.
*   The application interacts directly with the Hedera Testnet via the Hedera SDK for JavaScript.

## 4. Architecture Diagram

```
  +----------------+      +--------------------+      +-----------------+
  |                |      |                    |      |                 |
  |  React Frontend|----->| Hedera JS SDK      |----->|  Hedera Testnet |
  |  (Allupay UI)  |      | (in-browser)       |      |  (Consensus &   |
  |                |      |                    |      |   Mirror Nodes) |
  +----------------+      +--------------------+      +-----------------+

  Data Flow:
  1. User initiates a crypto transfer or balance check from the UI.
  2. The React application uses the Hedera JS SDK to create and sign the transaction/query.
  3. The SDK submits the request to a Hedera Testnet node.
  4. The network reaches consensus, and the result (or state) is returned.
  5. The UI updates to reflect the confirmed transaction or new balance.
```

## 5. Deployed Hedera IDs (Testnet)

*   **Primary Application Account ID:** `[Your-VITE_MY_ACCOUNT_ID-Here]`
*   **HTS Token IDs:** None (Not used in this project)
*   **HCS Topic IDs:** None
*   **Smart Contract IDs:** None 

```

### 3. Preparing for the Demo Video & Pitch Deck

While I can't create the video or slides, I can give you the exact technical points to highlight, aligning them with the guidelines.

**For the Demo Video :**

1.  **Start on the Cryptocurrency page.**
2.  Show the current HBAR balance being displayed (explain this is fetched live from the testnet).
3.  Enter a recipient's Hedera Testnet Account ID (have one ready).
4.  Enter an amount of HBAR to send.
5.  Click "Send HBAR".
6.  **Crucially, as soon as the "Successfully sent" message appears, switch to your browser tab with HashScan open.**
7.  Paste your account ID (`VITE_MY_ACCOUNT_ID`) into HashScan and show the transaction appearing at the top of the list. Click on it to show the details: the `TransferTransaction` with the correct amount sent from your account to the recipient. This directly proves the on-chain interaction.

**For the Pitch Deck (Slide 4 & 6):**

*   **Slide 4: Why Hedera?** Use the "Economic Justification" section from the `README.md` I generated. Emphasize that for a payments app in Africa, low, fixed fees and fast finality aren't just nice-to-haves; they are fundamental requirements for user adoption and business viability.
*   **Slide 6: Product/Architecture & TRL:** Use the ASCII architecture diagram from the `README.md`. State your TRL as **TRL 4 (Prototype)**, because you have a key component (crypto transfers) functioning in a simulated operational environment (the Hedera Testnet).
"# Allupay" 
