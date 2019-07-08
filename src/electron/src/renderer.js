// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const { shell } = require("electron");
const { getConf, setConf } = require("./config");
const window = require("global/window");
const { ipcRenderer } = require("electron");
const isDev = require("electron-is-dev");
const document = require("global/document");
const console = require("global/console");

let globalState = {
  state: {
    base: {
      analytics: { googleTid: "UA-111756489-2" },
      csrfToken: "85kUCH5s-Bi79KUZzoncB-5rreEOJsYBKey8",
      translations: {
        "meta.title": "Blockchain Explorer - IoTeX",
        "meta.description":
          "Exploring IoTeX blockchain Address, Actions, and Smart Contracts.",
        "topbar.brand": "Brand",
        "topbar.blockchain": "Blockchain",
        "topbar.blocks": "Blocks",
        "topbar.actions": "Actions",
        "topbar.home": "Home",
        "not_found.bar": "Not Found",
        "not_found.title": "Oops!",
        "not_found.info": "We cannot find the page for you...",
        "candidate.delegate_name": "Delegate Name",
        "candidate.status": "Status",
        "candidate.live_votes": "LiveVotes",
        "candidate.percent": "Percent",
        "candidates.election.ELECTED": "Elected",
        "candidates.election.NOT_ELECTED": "Not Elected",
        "candidates.election.UNQUALIFIED": "Not Elected",
        "candidates.election.explain":
          "Delegates must self-stake at least \u003Cb\u003E1,200,000 IOTX\u003C\u002Fb\u003E and earn \u003Cb\u003E2,000,000 IOTX\u003C\u002Fb\u003E total votes to be elected.",
        "block.block": "Block",
        "block.blocks": "Blocks",
        "block.height": "Height",
        "block.hash": "Hash",
        "block.timestamp": "Age",
        "block.num_actions": "Actions",
        "block.producer_address": "Producer",
        "block.transfer_amount": "Transfer Amount",
        "block.tx_root": "Tx Root",
        "block.receipt_root": "Receipt Root",
        "block.delta_state_digest": "Digest of Delta State",
        "action.type": "Type",
        "action.type.transfer": "Transfer",
        "action.type.grant_reward": "Grant Reward",
        "action.type.execution": "Execution",
        "action.data": "Data",
        "topbar.graphql_playground": "GraphQL Playground",
        "topbar.graphql_doc": "GraphQL Doc",
        "action.hash": "Hash",
        "action.block_hash": "Block",
        "action.amount": "Amount",
        "action.action": "Action",
        "action.sender": "Sender",
        "action.recipient": "Recipient",
        "action.notFound":
          "Sorry, we are unable to locate this transaction Hash",
        "title.action": "Action",
        "render.key.height": "Height",
        "render.key.hash": "Hash",
        "render.key.timestamp": "Age",
        "render.key.numActions": "Actions",
        "render.key.producerAddress": "Producer",
        "render.key.transferAmount": "Transfer Amount",
        "render.key.txRoot": "Tx Root",
        "render.key.receiptRoot": "Receipt Root",
        "render.key.deltaStateDigest": "Digest of Delta State",
        "render.key.actHash": "Hash",
        "render.key.blkHash": "Block",
        "render.key.actionType": "Type",
        "render.key.actionData": "Data",
        "render.key.sender": "Sender",
        "render.key.amount": "Amount",
        "render.key.contract": "Contract",
        "render.key.data": "Data",
        "render.key.recipient": "Recipient",
        "render.key.payload": "Payload",
        "render.key.type": "Reward Type",
        "render.value.grantReward": "Grant Reward",
        "render.value.execution": "Execution",
        "render.value.transfer": "Transfer",
        "action.type.grantReward": "Grant Reward",
        "action.type.depositToRewardingFund": "deposit To Rewarding Fund",
        "action.type.claimFromRewardingFund": "claim From RewardingFund",
        "action.type.startSubChain": "start SubChain",
        "action.type.stopSubChain": "stop SubChain",
        "action.type.putBlock": "put Block",
        "action.type.createDeposit": "create Deposit",
        "action.type.settleDeposit": "settle Deposit",
        "action.type.createPlumChain": "create PlumChain",
        "action.type.terminatePlumChain": "terminate PlumChain",
        "action.type.plumPutBlock": "plum PutBlock",
        "action.type.plumCreateDeposit": "plum CreateDeposit",
        "action.type.plumStartExit": "plum StartExit",
        "action.type.plumChallengeExit": "plum ChallengeExit",
        "action.type.plumResponseChallengeExit": "plum Response Challenge Exit",
        "action.type.plumFinalizeExit": "plum Finalize Exit",
        "action.type.plumSettleDeposit": "plum Settle Deposit",
        "action.type.plumTransfer": "plum Transfer",
        "action.type.putPollResult": "put Poll Result",
        "render.key.chainID": "chain ID",
        "render.key.securityDeposit": "Security Deposit",
        "render.key.operationDeposit": "Operation Deposit",
        "render.key.startHeight": "Start Height",
        "render.key.parentHeightOffset": "parentHeightOffset",
        "render.key.stopHeight": "Stop Height",
        "render.key.subChainAddress": "subChain Address",
        "render.key.roots": "roots",
        "render.key.index": "Index",
        "render.key.previousTransfer": "previous Transfer",
        "render.key.previousTransferBlockProof":
          "previous Transfer Block Proof",
        "render.key.previousTransferBlockHeight":
          "previous Transfer Block Height",
        "render.key.exitTransfer": "exit Transfer",
        "render.key.exitTransferBlockProof": "exitTransferBlockProof",
        "render.key.exitTransferBlockHeight": "exitTransferBlockHeight",
        "render.key.challengeTransfer": "challengeTransfer",
        "render.key.challengeTransferBlockProof": "challengeTransferBlockProof",
        "render.key.challengeTransferBlockHeight":
          "challengeTransferBlockHeight",
        "render.key.responseTransfer": "responseTransfer",
        "render.key.responseTransferBlockProof": "responseTransferBlockProof",
        "render.key.coinID": "coin ID",
        "render.key.denomination": "denomination",
        "render.key.owner": "owner",
        "render.key.candidates": "candidates",
        "topbar.search":
          "Search by Address \u002F Public Key \u002F Hash \u002F Height",
        "coming_soon.title": "Coming Soon...",
        "coming_soon.bar": "coming soon",
        "action.actions": "Actions",
        "address.address": "Address",
        "title.overview": "Overview",
        "title.actionList": "List of Actions",
        "copy.copied": "Copied",
        "copy.toClipboard": "Copy address to clipboard",
        "input.error.private_key.invalid": "Please input your private key",
        "input.error.private_key.length": "Private key has to be of length 72",
        "wallet.unlock.new.title": "Please pay attention",
        "wallet.unlock.new.p1":
          "We do not store your private key on the server. The private key generation is handled on your browser only.",
        "wallet.unlock.new.p2":
          "Back up your private key because you will use it to access your wallet. If you lose your private key, it cannot be recovered.",
        "unlock-wallet.title": "Unlock your wallet",
        "unlock-wallet.warn.message":
          "Please double-check the URL & SSL cert. It should say https:\u002F\u002Fwww.iotexscan.io in your URL bar.",
        "wallet.account.enterPrivateKey": "Private Key",
        "wallet.account.placehold.privateKey": "Paste your private key here",
        "account.empty.unlock": "Unlock your wallet to see details!",
        "unlock-wallet.no-wallet": "Don't have a IoTeX wallet yet?",
        "unlock-wallet.create": "Create a new wallet",
        "unlock-wallet.main-chain":
          "Please go to mainchain to create a wallet.",
        "render.key.gasPrice": "Gas Price",
        "render.key.gasLimit": "Gas Limit",
        "render.key.overview": "Overview",
        "render.value.rewardType.BlockReward": "Block Reward",
        "render.value.rewardType.EpochReward": "Epoch Reward",
        "home.producer": "PRODUCER",
        "home.blockHeight": "BLOCK HEIGHT",
        "home.currentTPS": "CURRENT TPS",
        "home.IOTXPrice": "IOTX PRICE",
        "home.marketCap": "MARKETCAP",
        "time.fn.years": "years",
        "time.fn.year": "year",
        "time.fn.months": "months",
        "time.fn.month": "month",
        "time.fn.days": "days",
        "time.fn.day": "day",
        "time.fn.hours": "hours",
        "time.fn.hour": "hour",
        "time.fn.minutes": "minutes",
        "time.fn.minute": "minute",
        "time.fn.ago": "ago",
        "time.fn.justnow": "just now",
        "address.balance": "balance",
        "address.nonce": "nonce",
        "address.pendingNonce": "pendingNonce",
        "wallet.unlock.new.yes": "I understand, continue",
        "wallet.account.unlock": "Unlock",
        "title.receipt": "Receipt",
        "render.key.returnValue": "Return Value",
        "render.key.status": "Status",
        "render.key.blkHeight": "Block Height",
        "render.key.gasConsumed": "Gas Consumed",
        "render.key.contractAddress": "Contract Address",
        "render.key.logs": "Logs",
        "wallet.title.wallet": "Wallet",
        "wallet.contract.title": "Contract",
        "wallet.contract.learn": "Learn more",
        "wallet.contract.chooseFunction": "Please choose an action.",
        "wallet.contract.interactWith": "Interact with contract",
        "wallet.contract.deployContract": "Deploy contract",
        "wallet.contract.interactWith.desc":
          "This is a sentence of description. This is a sentence of description.",
        "wallet.contract.deployContract.desc":
          "This is a sentence of description. This is a sentence of description.",
        "button.backHome": "Back Home",
        "wallet.account.raw": "Account Address",
        "wallet.account.private": "Private Key",
        "wallet.account.addressPlaceHolder": "IoTeX Address...",
        "new-wallet.copy": "Copy",
        "new-wallet.created": "Wallet is created! Save your",
        "new-wallet.privateKey": "Private Key",
        "new-wallet.warn.cant-recover":
          "It cannot be recovered if you lose it.",
        "new-wallet.warn.stolen":
          "Your funds will be stolen if you use this file on a malicious\u002Fphishing site.",
        "new-wallet.warn.secure":
          "Secure it like the millions of dollars it may one day be worth.",
        "new-wallet.button.unlock": "I understand, Unlock Wallet",
        "account.why": "Why save your private key?",
        "account.save": "Save your private key to access your wallet later",
        "account.pay-attention": "Pay attention",
        "account.not-hold":
          "IoTeX.io does not hold your keys for you. We cannot access accounts recover keys, nor reverse transactions",
        "account.protect":
          "Protect your keys & always check that you are on correct URL.",
        "account.responsible": "You are responsible for your security.",
        "account.wallet": "Wallet",
        "account.change": "Change Wallet",
        "account.testnet.token": "IOTX",
        "account.address": "Account Address",
        "account.transaction-history": "Go to transaction history",
        "wallet.write.contract.title": "Warining",
        "wallet.write.contract.ok": "Generate transaction",
        "wallet.write.contract.p1": "You are about to",
        "wallet.write.contract.p1.b": "execute a function on contract.",
        "wallet.write.contract.p2":
          "It will be deployed on the following network",
        "wallet.write.contract.p3":
          "Amount to send. In most cases you should leave it as 0.",
        "wallet.contract.back": "Back to actions",
        "wallet.interact.access": "Access",
        "wallet.interact.title": "Interact with contract",
        "wallet.input.to": "Recipient address",
        "wallet.input.nonce": "Nonce",
        "wallet.input.gasPrice": "Gas Price",
        "wallet.input.gasLimit": "Gas Limit",
        "wallet.input.abi": "ABI \u002F JSON Interface",
        "wallet.input.byteCode": "Byte Code",
        "wallet.input.solidity": "Solidity (optional)",
        "wallet.input.contractAddress": "Contract address",
        "wallet.deploy.generateAbiAndByteCode": "Generate ABI and Byte Code",
        "wallet.deploy.title": "Deploy contract",
        "wallet.deploy.broadcast.fail":
          "Please try to send Smart Contract later",
        "wallet.deploy.send-new": "Send new contract",
        "wallet.deploy.detail-title": "You are about to deploy ...",
        "wallet.deploy.deploy": "Deploy Contract",
        "wallet.deploy.signTransaction": "Sign Transaction",
        "wallet.placeholder.solidity": "pragma solidity ^0.4.23; ...",
        "wallet.placeholder.abi": "...",
        "wallet.placeholder.byteCode": "0x1234 ...",
        "wallet.placeholder.contractAddress": "io...",
        "wallet.tab.transfer": "Send ${token}",
        "wallet.tab.vote": "Vote for delegate",
        "wallet.tab.contract": "Smart Contracts",
        "wallet.input.amount": "Amount",
        "wallet.choice.input.data": "Data (optional)",
        "wallet.input.dib": "Data Hex",
        "wallet.input.generate": "Generate Transaction",
        "wall.input.gasLimit-help":
          "The gas limit in the demo wallet is always 0.",
        "wallet.transfer.title": "Send IOTX",
        "wallet.error.required": "This field is required",
        "wallet.error.number": "This field should be number",
        "wallet.confirm.contract.title": "You are about to send ...",
        "wallet.confirm.contract.p1":
          "After sending this, your account balance will be",
        "wallet.confirm.contract.p2": "Are you sure you want to do this?",
        "wallet.confirm.contract.yes": "Yes, make transaction",
        "wallet.confirm.contract.cancel": "No, cancel",
        "wallet.contract.interaction.success":
          "Broadcast transaction successfully.",
        "wallet.contract.interaction.success.p1":
          "Your request has been broadcast to the network. This does not mean it has been mined on the blockchain. It usually takes a few seconds to confirm.",
        "wallet.contract.interaction.success.p2":
          "You can check the status right now by click following button or save your TX hash and check the status later.",
        "wallet.contract.interaction.success.p3": "Your action hash",
        "wallet.contract.button.check": "Check action status",
        "wallet.contract.button.new": "Send new IOTX & token",
        "wallet.transactions.send": "Send Transaction",
        "broadcast.success": "Broadcast transaction successfully",
        "broadcast.warn.one":
          "Your TX has been broadcast to the network. This does not mean it has been mined on the blockchain. It usually take a few seconds to confirm.",
        "broadcast.warn.two":
          "You can check the status right now by clicking the following button or save your TX hash and check the status later",
        "broadcast.warn.three": "Your TX hash:",
        "broadcast.button.check": "Check TX Status",
        "broadcast.fail": "Fail to broadcast transaction",
        "broadcast.fail.network":
          "The transaction failed to be broadcast to the network",
        "broadcast.error.message": "Error message:",
        "broadcast.suggested.action": "Suggested actions:",
        "wallet.transfer.sendNew": "Send new",
        "render.key.nonce": "nonce",
        "wallet.vote.title": "Vote for delegate",
        "wallet.vote.content": "Help IoTeX Build A Stronger Network",
        "wallet.vote.button": "Vote on member.iotex.io",
        "wallet.missing_solidity_pragma": "Incorrect Solidity",
        "wallet.cannot_find_solidity_version": "Cannot find solidity version",
        "input.error.raw_address.length": "IOTX address has to be of length 41",
        "candidate.productivity": "Productivity",
        "candidates.election.consensus_delegates": "IoTeX Consensus Delegates",
        "candidates.election.delegates": "IoTeX Delegates",
        "candidates.election.delegates_candidates":
          "IoTeX Delegates Candidates",
        "wallet.interact.invalidABI": "Invalid JSON ABI",
        "wallet.interact.abiTemplate":
          '[{ "type":"contructor", "inputs": [{ "name":"param1", "type":"uint256", "indexed":true }], "name":"Event" }, { "type":"function", "inputs": [{"name":"a", "type":"uint256"}], "name":"foo", "outputs": [{"name":"a", "type":"uint256"}] }]',
        "wallet.interact.contract": "Interact with smart contract",
        "abi.input": "Input",
        "abi.return": "Return",
        "wallet.lock.title": "Locking Wallet",
        "wallet.lock.cutdown":
          "Your wallet will be locked in 10 minutes. Do you want to continue using it?",
        "wallet.lock.btn.know": "I know",
        "wallet.lock.btn.yes": "Yes, dismiss the lock",
        "wallet.lock.btn.no": "Lock it",
        "wallet.abi.read": "Read contract",
        "wallet.abi.write": "Write contract",
        "new-wallet.warn.do-not-lose": "Do not lose private key!",
        "new-wallet.warn.do-not-share": "Do not share private key!",
        "new-wallet.warn.backup": "Make a backup!",
        "topbar.wallet": "Wallet",
        "render.key.actionFee": "Action Fee",
        "block.show_more": "Show More",
        "block.show_less": "Show Less",
        "new-wallet.download": "Download Keystore File (UTC \u002F JSON)",
        "wallet.cannot_load_solidity_version": "Cannot load solidity version",
        "new-wallet.save_keystore":
          '\u003Cdiv\u003E\u003Cp class="wallet-title" style="display: inline-block;"\u003ESave your\u003C\u002Fp\u003E\u003Cp class="private-key"\u003Ekeystore file\u003C\u002Fp\u003E\u003C\u002Fdiv\u003E',
        "wallet.input.password": "Password",
        "input.error.password.too_weak": "Password is too weak.",
        "unlock_by_keystore_file.never_upload":
          "We never upload or store your private key on the server. The keystore file here is handled locally.",
        "wallet.input.keystore": "Keystore File",
        "unlock-wallet.by_keystore": "By Keystore",
        "unlock-wallet.by_private_key": "By Private Key",
        "unlock_by_keystore_file.select_file": "Select File",
        "input.error.keystore.required": "Keystore file is required.",
        "input.error.keystore.invalid": "Keystore file is invalid.",
        "input.error.keystore.failed_to_derive":
          "Key derivation failed. Possibly wrong password.",
        "block.success": "Success",
        "block.failure": "Failure",
        "action.copy_link": "Copy Link",
        "action.email": "Email",
        "action.share_this_action": "Share this Action",
        "action.click_send_email": "Click to send email",
        "unlock_by_keystore_file.browse_file": "Browse file...",
        "copy.scan": "Scan the QR code",
        "topbar.goback_home": "Go back home",
        "topbar.voting": "Voting",
        "topbar.dashboard": "Dashboard",
        "topbar.tools": "Tools",
        "footer.policy": "Team of Use & Privacy Policy.",
        "footer.enter_email": "Enter email for Iotex updates!",
        "footer.subscribe": "Subscribe",
        "home.blocklist.ofActions": "of actions",
        "signin_modal.wallet": "IoTeX Wallet",
        "signin_modal.sign_in": "Sign In with IoTeX Wallet",
        "signin_modal.download": "Haven't installed yet? Download",
        "topbar.sign_in": "Sign In",
        "candidates.delegate_list": "Delegate List",
        "candidates.rank": "Rank",
        "candidates.election.NOT_EQUIPPED": "Not Equipped",
        "candidates.election.ONLINE": "Online",
        "candidates.election.OFFLINE": "Offline",
        "footer.subscribe.success": "Subscribe success!",
        "footer.subscribe.failed": "Subscribe fail, please try again later!",
        "wallet.contract.executeParameter": "Contract execute parameters",
        "wallet.input.fromErc20": "ERC20 Token address",
        "wallet.input.getInfo": "Get info",
        "wallet.erc20.title": "Send VITA",
        "wallet.tab.erc20": "ERC20",
        "wallet.input.balance": "Balance:",
        "wallet.transfer.send-erc20": "Send ERC20 tokens",
        "input.error.erc20_address.length":
          "ERC20 Token address has to be of length 41",
        "wallet.bytecode.copy": "Copy ByteCode",
        "render.key.to": "To",
        "render.key.tokens": "Tokens Transferred",
        "account.erc20.addCustom": "Custom Tokens",
        "wallet.input.type": "Type",
        "account.erc20.notfound": "Token not found!",
        "multiChain.chains.mainnet": "Main IoTeX Network",
        "multiChain.chains.testnet": "IoTeX Test Network",
        "multiChain.chains.custom": "Custom RPC",
        "wallet.input.name": "Name",
        "wallet.input.url": "Url",
        "account.addCustomRPC": "Add custom RPC",
        "account.rpc.nameHolder": "My RPC",
        "input.error.url.invalid": "Invalid URL",
        "input.error.rpc.invalid": "Can't connect to Network Provider!",
        "wallet.input.fromXrc20": "XRC20 Token address",
        "wallet.tab.xrc20": "XRC20",
        "wallet.transfer.send-xrc20": "Send XRC20 tokens",
        "input.error.xrc20_address.length":
          "XRC20 Token address has to be of length 41",
        "account.refresh": "Refresh balances",
        "account.switchAccount": "Switch Account",
        "account.token.addCustom": "Custom Tokens",
        "account.token.notfound": "Token not found!",
        "account.joinDiscord": "Join Discord",
        "account.claim": "Claim",
        "confirmation.amount": "Amount",
        "confirmation.fromAddress": "From address",
        "confirmation.toAddress": "To addresss",
        "confirmation.toContract": "To contract",
        "confirmation.limit": "Gas limit",
        "confirmation.price": "Gas price",
        "confirmation.data": "Data",
        "confirmation.method": "Method",
        "input.error.bytes.invalid": "Invalid byte code",
        "render.key.ownerETH": "Owner (Eth)",
        "account.claimAs": "Claim As",
        "confirmation.owner": "Owner",
        "account.claimAs.authorizedMessage": "Authentication private message",
        "account.claimAs.authorizedTemplate":
          '{\n  "address": "0x497...",\n  "msg": "1I authorize 0x0123...",\n  "sig": "0xfa076d068...",\n  "version": "2"\n}',
        "account.error.invalidAuthorizedMessage":
          "Invalid authentication private message!",
        "render.key.method": "Method",
        "account.claimAs.generateAuthMessage":
          "Generate an authenticate message",
        "account.claimAs.authMessage": "Authenticate message",
        "account.claimAs.generate": "Generate",
        "account.claimAs.close": "Close",
        "account.bid": "Bid",
        "account.error.notEnoughBalance":
          "You don't have enough IoTx balance to perform the action!",
        "account.placeBid": "Place bid for VITA",
        "account.availableForBid": "Your balance available for bidding: ",
        "erc20.execution.error.lowGasInput": "Gas input too low!",
        "erc20.execution.error.notEnoughBalance":
          "Your IoTx balance is not enough to execute the transaction!",
        "topbar.explorer_playground": "Explorer Playground",
        "topbar.analytics_playground": "Analytics Playground",
        "wallet.tab.keystore": "Export Keystore",
        "wallet.tab.keystore.title": "Save your keystore file",
        "wallet.transfer.broadcast.fail": "Increase gasLimit and try again!"
      },
      locale: "en",
      supportedLocales: ["en", "de", "it", "zh-CN"],
      manifest: {
        "\u002Fmain.js": "main-91ae73be4b5a740dc545.js",
        "\u002Fmemory-main.js": "memory-main-390eaaeeb3e221966add.js"
      },
      bidContractAddress: "io16alj8sw7pt0d5wv22gdyphuyz9vas5dk8czk88",
      vitaTokens: [
        "io1hp6y4eqr90j7tmul4w2wa8pm7wx462hq0mg4tw",
        "io14j96vg9pkx28htpgt2jx0tf3v9etpg4j9h384m"
      ],
      multiChain: {
        current: "mainnet",
        chains: [
          { name: "mainnet", url: "https:\u002F\u002Fiotexscan.io\u002F" },
          {
            name: "testnet",
            url: "https:\u002F\u002Ftestnet.iotexscan.io\u002F"
          }
        ]
      },
      defaultERC20Tokens: [
        "io1hp6y4eqr90j7tmul4w2wa8pm7wx462hq0mg4tw",
        "io14j96vg9pkx28htpgt2jx0tf3v9etpg4j9h384m"
      ],
      webBpApiGatewayUrl:
        "https:\u002F\u002Fmember.iotex.io\u002Fapi-gateway\u002F",
      enableSignIn: false,
      apiGatewayUrl: "https:\u002F\u002Fiotexscan.io\u002Fapi-gateway\u002F"
    },
    apolloState: {
      "$ROOT_QUERY.fetchVersionInfo": {
        explorerVersion: "v1.2.0",
        iotexCoreVersion: "v0.6.2",
        __typename: "VersionInfo"
      },
      ROOT_QUERY: {
        fetchVersionInfo: {
          type: "id",
          generated: true,
          id: "$ROOT_QUERY.fetchVersionInfo",
          typename: "VersionInfo"
        },
        chainMeta: {
          type: "id",
          generated: true,
          id: "$ROOT_QUERY.chainMeta",
          typename: "ChainMeta"
        },
        fetchCoinPrice: {
          type: "id",
          generated: true,
          id: "$ROOT_QUERY.fetchCoinPrice",
          typename: "CoinPrice"
        },
        'getBlockMetas({"byIndex":{"count":1,"start":678434}})': {
          type: "id",
          generated: true,
          id:
            '$ROOT_QUERY.getBlockMetas({"byIndex":{"count":1,"start":678434}})',
          typename: "GetBlockMetasResponse"
        }
      },
      "$ROOT_QUERY.chainMeta": {
        height: "678434",
        numActions: "704590",
        tps: "0",
        epoch: {
          type: "id",
          generated: true,
          id: "$ROOT_QUERY.chainMeta.epoch",
          typename: "Epoch"
        },
        __typename: "ChainMeta"
      },
      "$ROOT_QUERY.chainMeta.epoch": {
        num: 1885,
        height: 678241,
        __typename: "Epoch"
      },
      "$ROOT_QUERY.fetchCoinPrice": {
        priceUsd: "0.0087",
        marketCapUsd: "34.50",
        __typename: "CoinPrice"
      },
      '$ROOT_QUERY.getBlockMetas({"byIndex":{"count":1,"start":678434}}).blkMetas.0': {
        producerAddress: "io1gfq9el2gnguus64ex3hu8ajd6e4yzk3f9cz5vx",
        hash:
          "8b77bea0c6fdb283c1745554832fa58159bcc9ef9246d9607b1427dce59e2f2c",
        __typename: "BlockMeta"
      },
      '$ROOT_QUERY.getBlockMetas({"byIndex":{"count":1,"start":678434}})': {
        blkMetas: [
          {
            type: "id",
            generated: true,
            id:
              '$ROOT_QUERY.getBlockMetas({"byIndex":{"count":1,"start":678434}}).blkMetas.0',
            typename: "BlockMeta"
          }
        ],
        __typename: "GetBlockMetasResponse"
      }
    },
    webBpApolloState: {
      ROOT_QUERY: {}
    },
    wallet: { customRPCs: [], tokens: {}, defaultNetworkTokens: [] }
  }
};

window.xopen = function(url) {
  shell.openExternal(url);
};

// The xconf is used to store user configurations with electron.
// Config's value should be able to store under JSON string.
window.xconf = new (function() {
  return {
    getConf,
    setConf
  };
})();

let solcID = 1;
window.solidityCompile = function(source, callback) {
  const arg = {
    id: solcID++,
    source
  };
  ipcRenderer.once(`solc-reply-${arg.id}`, (_, arg) => callback(arg));
  ipcRenderer.send("solc", arg);
};

window.document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("json-globals").innerText = JSON.stringify(
    globalState
  );
  require("../../../dist/memory-main.js");
  if (isDev) {
    ["../../../dist/stylesheets/main.css", "../../../dist/antd.css"].forEach(
      it => {
        const link = window.document.createElement("link");
        link.rel = "stylesheet";
        link.href = it;
        window.document.getElementsByTagName("head")[0].appendChild(link);
      }
    );
  }
});

window.signed = function(id, response) {
  ipcRenderer.send(`signed-${id}`, response);
};

ipcRenderer.on("query", function(event, query) {
  const actionEvent = {
    type: "QUERY_PARAMS",
    payload: { ...query, queryNonce: Math.random() }
  };
  console.log("dispatching ", JSON.stringify(actionEvent));
  window.dispatch(actionEvent);
});

ipcRenderer.on("sign", function(event, payload) {
  const actionEvent = {
    type: "SIGN_PARAMS",
    payload: JSON.parse(payload)
  };
  console.log("dispatching", JSON.stringify(actionEvent));
  window.dispatch(actionEvent);
});
