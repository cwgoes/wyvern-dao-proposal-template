const fs = require('fs')
const { ethers } = require('ethers')
const prompts = require('prompts')

const wyvernDAO = new ethers.Contract(
  "0x17F68886d00845867C154C912b4cCc506EC92Fc7",
  [{"constant":false,"inputs":[{"name":"proposalNumber","type":"uint256"},{"name":"transactionBytecode","type":"bytes"}],"name":"executeProposal","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"beneficiary","type":"address"},{"name":"weiAmount","type":"uint256"},{"name":"jobMetadataHash","type":"bytes"},{"name":"transactionBytecode","type":"bytes"}],"name":"newProposal","outputs":[{"name":"proposalID","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]
)
const wyvernDAOProxy = new ethers.Contract(
  "0xa839D4b5A36265795EbA6894651a8aF3d0aE2e68",
  [{"constant":false,"inputs":[{"name":"dest","type":"address"},{"name":"calldata","type":"bytes"}],"name":"delegateProxyAssert","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}],
)
const wyvernAtomicizer = new ethers.Contract(
  "0xC99f70bFD82fb7c8f8191fdfbFB735606b15e5c5",
  [{"constant":false,"inputs":[{"name":"addrs","type":"address[]"},{"name":"values","type":"uint256[]"},{"name":"calldataLengths","type":"uint256[]"},{"name":"calldatas","type":"bytes"}],"name":"atomicize","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}],
)
const daiToken = new ethers.Contract("0x6b175474e89094c44da98b954eedeac495271d0f", JSON.parse(fs.readFileSync('./dai.json')))

const generateProposal = (targetAddress, daiAmount, etherAmount) => {
  const transferData = daiToken.interface.encodeFunctionData('transfer', [targetAddress, ethers.utils.parseEther(daiAmount)])
  const newProposalTransactionBytecode = wyvernDAOProxy.interface.encodeFunctionData(
    'delegateProxyAssert',
    [
      wyvernAtomicizer.address,
      wyvernAtomicizer.interface.encodeFunctionData(
        'atomicize',
        [
            [daiToken.address, targetAddress],
            ['0', ethers.utils.parseEther(etherAmount)],
            [(transferData.length - 2) / 2, 0],
            transferData
        ]
      )
    ]
  )

  const proposal = {
    to: wyvernDAO.address,
    function: `newProposal`,
    arguments: {
      beneficiary: wyvernDAOProxy.address,
      weiAmount: 0,
      jobMetadataHash: "0x",
      transactionBytecode: newProposalTransactionBytecode,
    }
  }

  return proposal

}

async function main() {
  console.log('Welcome to the Wyvern DAO proposal creation assistant!')
  console.log('Please enter some details about your proposal, and this script will output bytecode which you can send as a transaction.')
  const response = await prompts(
    [
      {
        type: 'text',
        name: 'target',
        message: 'Who should receive the funds?'
      },
      {
        type: 'text',
        name: 'amountDAI',
        message: 'How much DAI should they receive?'
      },
      {
        type: 'text',
        name: 'amountETH',
        message: 'How much Ether should they receive?'
      }
    ]
  )

  const proposal = generateProposal(response.target, response.amountDAI, response.amountETH)
  console.log(proposal)
}

main()
