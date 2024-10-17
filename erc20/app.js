let web3;
let contract;
const contractAddress = "0x2E9d30761DB97706C536A112B9466433032b28e3"; // 合约地址
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
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "deadline",
                "type": "uint256"
            },
            {
                "internalType": "uint8",
                "name": "v",
                "type": "uint8"
            },
            {
                "internalType": "bytes32",
                "name": "r",
                "type": "bytes32"
            },
            {
                "internalType": "bytes32",
                "name": "s",
                "type": "bytes32"
            }
        ],
        "name": "permit",
        "outputs": [],
        "stateMutability": "nonpayable",
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

document.getElementById("connectWalletBtn").addEventListener("click", async () => {
    if (window.ethereum) {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            web3 = new Web3(window.ethereum);
            contract = new web3.eth.Contract(abi, contractAddress);
            document.getElementById("status").innerText = "Wallet connected!";
        } catch (error) {
            console.error("Error connecting to wallet:", error);
            document.getElementById("status").innerText = "Failed to connect wallet.";
        }
    } else {
        alert("Please install MetaMask or another wallet.");
    }
});

document.getElementById("signPermitBtn").addEventListener("click", async () => {
    const accounts = await web3.eth.getAccounts();
    const owner = accounts[0]; // 使用当前账户
    const spender = owner; // 这里使用同一个地址进行测试
    const value = web3.utils.toWei("1", "ether"); // 设置授权值
    const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10分钟后过期

    // 生成签名
    const { v, r, s } = await new Promise((resolve, reject) => {
        web3.eth.personal.sign(
            web3.utils.toHex("Permit message"),
            owner,
            (err, signature) => {
                if (err) reject(err);
                const sig = web3.eth.accounts.recover(signature);
                resolve({
                    v: sig.v,
                    r: sig.r,
                    s: sig.s,
                });
            }
        );
    });

    try {
        await contract.methods.permit(owner, spender, value, deadline, v, r, s).send({ from: owner });
        document.getElementById("status").innerText = "Permit signed successfully!";
    } catch (error) {
        console.error("Error signing permit:", error);
        document.getElementById("status").innerText = "Failed to sign permit.";
    }
});

document.getElementById("transferTokensBtn").addEventListener("click", async () => {
    const accounts = await web3.eth.getAccounts();
    const sender = accounts[0]; // 使用当前账户
    const recipient = sender; // 这里可以替换为其他地址进行测试
    const amount = web3.utils.toWei("1", "ether"); // 设置转移值

    try {
        await contract.methods.transferFrom(sender, recipient, amount).send({ from: sender });
        document.getElementById("status").innerText = "Tokens transferred successfully!";
    } catch (error) {
        console.error("Error transferring tokens:", error);
        document.getElementById("status").innerText = "Failed to transfer tokens.";
    }
});
