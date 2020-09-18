# ioPay: IoTeX wallet

This is a desktop version of iotex wallet.

## Development

Watch the server first.

```bash
cd ../../
npm run watch
```

Then open another terminal window.

```bash
npm run start
```

To build it in production

```bash
npm run build
```

## How To Release

1. bump the version of ioPay desktop in `/src/electron/package.json`

2. push a new tag of version by running the following command in your local machine

```
git tag vx.y.z
git push origin vx.y.z
```

in case you pushed wrong tag, you can remove it this way
1. remove tag locally
```
git tag -d [tagname]
```
2. remove tag in remote github repo
```
git push --delete origin [tagname]
```

After a new tag pushed to github, github action will start building desktop wallet and creating a draft release.

The building takes about 20mins. 

## Release steps

1. use tag to create a new draft release
2. download the app and allow 2-3 days testing from the team
3. publish the draft release

## Deep Link Integration

```text
iopay://?type=CONTRACT_INTERACT&amount=0&gasPrice=1&gasLimit=2&abi=encodeURIComponent(abi)&contractAddress=io123&method=unpause
```

for example, [unpause an XRC20 contract](iopay://?type=CONTRACT_INTERACT&amount=0&gasPrice=1&gasLimit=3&abi=%5B%7B%22constant%22%3Atrue%2C%22inputs%22%3A%5B%5D%2C%22name%22%3A%22name%22%2C%22outputs%22%3A%5B%7B%22name%22%3A%22%22%2C%22type%22%3A%22string%22%7D%5D%2C%22payable%22%3Afalse%2C%22stateMutability%22%3A%22view%22%2C%22type%22%3A%22function%22%7D%2C%7B%22constant%22%3Afalse%2C%22inputs%22%3A%5B%7B%22name%22%3A%22_spender%22%2C%22type%22%3A%22address%22%7D%2C%7B%22name%22%3A%22_value%22%2C%22type%22%3A%22uint256%22%7D%5D%2C%22name%22%3A%22approve%22%2C%22outputs%22%3A%5B%7B%22name%22%3A%22%22%2C%22type%22%3A%22bool%22%7D%5D%2C%22payable%22%3Afalse%2C%22stateMutability%22%3A%22nonpayable%22%2C%22type%22%3A%22function%22%7D%2C%7B%22constant%22%3Atrue%2C%22inputs%22%3A%5B%5D%2C%22name%22%3A%22totalSupply%22%2C%22outputs%22%3A%5B%7B%22name%22%3A%22%22%2C%22type%22%3A%22uint256%22%7D%5D%2C%22payable%22%3Afalse%2C%22stateMutability%22%3A%22view%22%2C%22type%22%3A%22function%22%7D%2C%7B%22constant%22%3Afalse%2C%22inputs%22%3A%5B%7B%22name%22%3A%22_from%22%2C%22type%22%3A%22address%22%7D%2C%7B%22name%22%3A%22_to%22%2C%22type%22%3A%22address%22%7D%2C%7B%22name%22%3A%22_value%22%2C%22type%22%3A%22uint256%22%7D%5D%2C%22name%22%3A%22transferFrom%22%2C%22outputs%22%3A%5B%7B%22name%22%3A%22%22%2C%22type%22%3A%22bool%22%7D%5D%2C%22payable%22%3Afalse%2C%22stateMutability%22%3A%22nonpayable%22%2C%22type%22%3A%22function%22%7D%2C%7B%22constant%22%3Atrue%2C%22inputs%22%3A%5B%5D%2C%22name%22%3A%22decimals%22%2C%22outputs%22%3A%5B%7B%22name%22%3A%22%22%2C%22type%22%3A%22uint256%22%7D%5D%2C%22payable%22%3Afalse%2C%22stateMutability%22%3A%22view%22%2C%22type%22%3A%22function%22%7D%2C%7B%22constant%22%3Afalse%2C%22inputs%22%3A%5B%5D%2C%22name%22%3A%22unpause%22%2C%22outputs%22%3A%5B%5D%2C%22payable%22%3Afalse%2C%22stateMutability%22%3A%22nonpayable%22%2C%22type%22%3A%22function%22%7D%2C%7B%22constant%22%3Atrue%2C%22inputs%22%3A%5B%5D%2C%22name%22%3A%22paused%22%2C%22outputs%22%3A%5B%7B%22name%22%3A%22%22%2C%22type%22%3A%22bool%22%7D%5D%2C%22payable%22%3Afalse%2C%22stateMutability%22%3A%22view%22%2C%22type%22%3A%22function%22%7D%2C%7B%22constant%22%3Afalse%2C%22inputs%22%3A%5B%7B%22name%22%3A%22_spender%22%2C%22type%22%3A%22address%22%7D%2C%7B%22name%22%3A%22_subtractedValue%22%2C%22type%22%3A%22uint256%22%7D%5D%2C%22name%22%3A%22decreaseApproval%22%2C%22outputs%22%3A%5B%7B%22name%22%3A%22success%22%2C%22type%22%3A%22bool%22%7D%5D%2C%22payable%22%3Afalse%2C%22stateMutability%22%3A%22nonpayable%22%2C%22type%22%3A%22function%22%7D%2C%7B%22constant%22%3Atrue%2C%22inputs%22%3A%5B%7B%22name%22%3A%22_owner%22%2C%22type%22%3A%22address%22%7D%5D%2C%22name%22%3A%22balanceOf%22%2C%22outputs%22%3A%5B%7B%22name%22%3A%22balance%22%2C%22type%22%3A%22uint256%22%7D%5D%2C%22payable%22%3Afalse%2C%22stateMutability%22%3A%22view%22%2C%22type%22%3A%22function%22%7D%2C%7B%22constant%22%3Afalse%2C%22inputs%22%3A%5B%5D%2C%22name%22%3A%22pause%22%2C%22outputs%22%3A%5B%5D%2C%22payable%22%3Afalse%2C%22stateMutability%22%3A%22nonpayable%22%2C%22type%22%3A%22function%22%7D%2C%7B%22constant%22%3Atrue%2C%22inputs%22%3A%5B%5D%2C%22name%22%3A%22owner%22%2C%22outputs%22%3A%5B%7B%22name%22%3A%22%22%2C%22type%22%3A%22address%22%7D%5D%2C%22payable%22%3Afalse%2C%22stateMutability%22%3A%22view%22%2C%22type%22%3A%22function%22%7D%2C%7B%22constant%22%3Atrue%2C%22inputs%22%3A%5B%5D%2C%22name%22%3A%22symbol%22%2C%22outputs%22%3A%5B%7B%22name%22%3A%22%22%2C%22type%22%3A%22string%22%7D%5D%2C%22payable%22%3Afalse%2C%22stateMutability%22%3A%22view%22%2C%22type%22%3A%22function%22%7D%2C%7B%22constant%22%3Afalse%2C%22inputs%22%3A%5B%7B%22name%22%3A%22_to%22%2C%22type%22%3A%22address%22%7D%2C%7B%22name%22%3A%22_value%22%2C%22type%22%3A%22uint256%22%7D%5D%2C%22name%22%3A%22transfer%22%2C%22outputs%22%3A%5B%7B%22name%22%3A%22%22%2C%22type%22%3A%22bool%22%7D%5D%2C%22payable%22%3Afalse%2C%22stateMutability%22%3A%22nonpayable%22%2C%22type%22%3A%22function%22%7D%2C%7B%22constant%22%3Afalse%2C%22inputs%22%3A%5B%7B%22name%22%3A%22_spender%22%2C%22type%22%3A%22address%22%7D%2C%7B%22name%22%3A%22_addedValue%22%2C%22type%22%3A%22uint256%22%7D%5D%2C%22name%22%3A%22increaseApproval%22%2C%22outputs%22%3A%5B%7B%22name%22%3A%22success%22%2C%22type%22%3A%22bool%22%7D%5D%2C%22payable%22%3Afalse%2C%22stateMutability%22%3A%22nonpayable%22%2C%22type%22%3A%22function%22%7D%2C%7B%22constant%22%3Atrue%2C%22inputs%22%3A%5B%7B%22name%22%3A%22_owner%22%2C%22type%22%3A%22address%22%7D%2C%7B%22name%22%3A%22_spender%22%2C%22type%22%3A%22address%22%7D%5D%2C%22name%22%3A%22allowance%22%2C%22outputs%22%3A%5B%7B%22name%22%3A%22%22%2C%22type%22%3A%22uint256%22%7D%5D%2C%22payable%22%3Afalse%2C%22stateMutability%22%3A%22view%22%2C%22type%22%3A%22function%22%7D%2C%7B%22constant%22%3Afalse%2C%22inputs%22%3A%5B%7B%22name%22%3A%22newOwner%22%2C%22type%22%3A%22address%22%7D%5D%2C%22name%22%3A%22transferOwnership%22%2C%22outputs%22%3A%5B%5D%2C%22payable%22%3Afalse%2C%22stateMutability%22%3A%22nonpayable%22%2C%22type%22%3A%22function%22%7D%2C%7B%22inputs%22%3A%5B%7B%22name%22%3A%22tokenTotalAmount%22%2C%22type%22%3A%22uint256%22%7D%5D%2C%22payable%22%3Afalse%2C%22stateMutability%22%3A%22nonpayable%22%2C%22type%22%3A%22constructor%22%7D%2C%7B%22anonymous%22%3Afalse%2C%22inputs%22%3A%5B%5D%2C%22name%22%3A%22Pause%22%2C%22type%22%3A%22event%22%7D%2C%7B%22anonymous%22%3Afalse%2C%22inputs%22%3A%5B%5D%2C%22name%22%3A%22Unpause%22%2C%22type%22%3A%22event%22%7D%2C%7B%22anonymous%22%3Afalse%2C%22inputs%22%3A%5B%7B%22indexed%22%3Atrue%2C%22name%22%3A%22previousOwner%22%2C%22type%22%3A%22address%22%7D%2C%7B%22indexed%22%3Atrue%2C%22name%22%3A%22newOwner%22%2C%22type%22%3A%22address%22%7D%5D%2C%22name%22%3A%22OwnershipTransferred%22%2C%22type%22%3A%22event%22%7D%2C%7B%22anonymous%22%3Afalse%2C%22inputs%22%3A%5B%7B%22indexed%22%3Atrue%2C%22name%22%3A%22owner%22%2C%22type%22%3A%22address%22%7D%2C%7B%22indexed%22%3Atrue%2C%22name%22%3A%22spender%22%2C%22type%22%3A%22address%22%7D%2C%7B%22indexed%22%3Afalse%2C%22name%22%3A%22value%22%2C%22type%22%3A%22uint256%22%7D%5D%2C%22name%22%3A%22Approval%22%2C%22type%22%3A%22event%22%7D%2C%7B%22anonymous%22%3Afalse%2C%22inputs%22%3A%5B%7B%22indexed%22%3Atrue%2C%22name%22%3A%22from%22%2C%22type%22%3A%22address%22%7D%2C%7B%22indexed%22%3Atrue%2C%22name%22%3A%22to%22%2C%22type%22%3A%22address%22%7D%2C%7B%22indexed%22%3Afalse%2C%22name%22%3A%22value%22%2C%22type%22%3A%22uint256%22%7D%5D%2C%22name%22%3A%22Transfer%22%2C%22type%22%3A%22event%22%7D%5D&contractAddress=io1xeg4xtsk85tlx4jtc2age3ch74ewu9dcpj266w&method=unpause)

## Web Socket Integration

ioPay wallet will serve web socket at 64102 during the Application initialization.

![](https://res.cloudinary.com/dohtidfqh/image/upload/v1566435752/web-guiguio/iopay-ws.svg)

When the user opens the DApp [integrated with iotex-antenna WsSignerPlugin](https://docs.iotex.io/docs/libraries-and-tools.html#working-with-desktop-wallet), our antenna SDK will connect to the wallet to get the address and send envelops.
