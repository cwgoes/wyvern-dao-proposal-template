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

const multicall = new ethers.Contract(
  "0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441",
  [{"constant":false,"inputs":[{"components":[{"name":"target","type":"address"},{"name":"callData","type":"bytes"}],"name":"calls","type":"tuple[]"}],"name":"aggregate","outputs":[{"name":"blockNumber","type":"uint256"},{"name":"returnData","type":"bytes[]"}],"payable":false,"stateMutability":"nonpayable","type":"function"}],
)

const daiToken = new ethers.Contract("0x6b175474e89094c44da98b954eedeac495271d0f", JSON.parse(fs.readFileSync('./dai.json')))

/*
const newProposalTransactionBytecode = wyvernDAOProxy.interface.encodeFunctionData(
  'delegateProxyAssert', // ensure that the proposal cannot be executed unless operation succeeds
  [
    multicall.address,   // delegatecall into the multicall contract
    multicall.interface.encodeFunctionData(
      'aggregate',
      [
        [
          {
            target: daiToken.address,
            callData: daiToken.interface.encodeFunctionData(
              'transfer',
              [
                targetAddress,
                targetAmount
              ]
            )
          }
        ]
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
        },
}

console.log(proposal)
*/

async function main() {
  const response = await prompts({
    type: 'confirm',
    name: 'value',
    message: 'Can you confirm?',
    initial: true
  })

  console.log('Reponse: ', response.value)
}

main()
