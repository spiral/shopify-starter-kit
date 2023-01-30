const TOKEN_ID = 0;
const contractABI = [{"inputs":[{"internalType":"bool[8]","name":"bools","type":"bool[8]"},{"internalType":"address[8]","name":"addresses","type":"address[8]"},{"internalType":"uint256[32]","name":"uints","type":"uint256[32]"},{"internalType":"string[8]","name":"strings","type":"string[8]"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newPrice","type":"uint256"},{"indexed":false,"internalType":"address","name":"bidder","type":"address"}],"name":"AuctionBidded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"address","name":"seller","type":"address"}],"name":"AuctionCancelled","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"startingPrice","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"startingTimestamp","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"endingTimestamp","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"minBidIncrement","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"minLastBidDuration","type":"uint256"},{"indexed":false,"internalType":"address","name":"seller","type":"address"}],"name":"AuctionCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"endTime","type":"uint256"},{"indexed":false,"internalType":"address","name":"seller","type":"address"}],"name":"AuctionEndTimeAltered","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"address","name":"buyer","type":"address"},{"indexed":false,"internalType":"address","name":"seller","type":"address"}],"name":"AuctionSettled","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"claimer","type":"address"},{"indexed":false,"internalType":"uint256","name":"originalTokenId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newTokenId","type":"uint256"},{"indexed":false,"internalType":"string","name":"originalIpfs","type":"string"}],"name":"ClaimableClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"hash","type":"bytes32"}],"name":"SaleCancelled","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"hash","type":"bytes32"}],"name":"SaleCompleted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"string","name":"claimedIpfsHash","type":"string"}],"name":"addClaimable","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"endTime","type":"uint256"}],"name":"alterEndTime","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"bidOnAuction","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"burnable","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"seller","type":"address"},{"internalType":"uint256","name":"version","type":"uint256"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256[4]","name":"pricesAndTimestamps","type":"uint256[4]"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"buyExistingToken","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"bool","name":"claimable","type":"bool"},{"internalType":"uint256","name":"version","type":"uint256"},{"internalType":"uint256[4]","name":"pricesAndTimestamps","type":"uint256[4]"},{"internalType":"string","name":"ipfsHash","type":"string"},{"internalType":"string","name":"claimedIpfsHash","type":"string"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"buyNewToken","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"cancelAuction","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"claimable","type":"bool"},{"internalType":"uint256","name":"version","type":"uint256"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256[4]","name":"pricesAndTimestamps","type":"uint256[4]"},{"internalType":"string","name":"ipfsHash","type":"string"},{"internalType":"string","name":"claimedIpfsHash","type":"string"}],"name":"cancelSale","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"claimToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"startingPrice","type":"uint256"},{"internalType":"uint256","name":"startingTimestamp","type":"uint256"},{"internalType":"uint256","name":"endingTimestamp","type":"uint256"},{"internalType":"uint256","name":"minBidIncrement","type":"uint256"},{"internalType":"uint256","name":"minLastBidDuration","type":"uint256"}],"name":"createAuction","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"address_","type":"address"}],"name":"getActiveVersion","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getAuction","outputs":[{"components":[{"internalType":"address","name":"topBidder","type":"address"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"uint256","name":"startTimestamp","type":"uint256"},{"internalType":"uint256","name":"endTimestamp","type":"uint256"},{"internalType":"uint256","name":"minBidIncrement","type":"uint256"},{"internalType":"uint256","name":"minLastBidDuration","type":"uint256"}],"internalType":"struct EaselyStandardCollection.Auction","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256[4]","name":"pricesAndTimestamps","type":"uint256[4]"}],"name":"getCurrentPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bool","name":"claimable","type":"bool"},{"internalType":"uint256","name":"version","type":"uint256"},{"internalType":"uint256[4]","name":"pricesAndTimestamps","type":"uint256[4]"},{"internalType":"string","name":"ipfsHash","type":"string"},{"internalType":"string","name":"claimedIpfsHash","type":"string"}],"name":"hashToSignToSellNewToken","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"version","type":"uint256"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256[4]","name":"pricesAndTimestamps","type":"uint256[4]"}],"name":"hashToSignToSellToken","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bool[8]","name":"bools","type":"bool[8]"},{"internalType":"address[8]","name":"addresses","type":"address[8]"},{"internalType":"uint256[32]","name":"uints","type":"uint256[32]"},{"internalType":"string[8]","name":"strings","type":"string[8]"}],"name":"init","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxRoyaltiesBPS","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxSecondaryBPS","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"collectorAddress","type":"address"},{"internalType":"string","name":"ipfsHash","type":"string"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"collectorAddress","type":"address"},{"internalType":"string","name":"ipfsHash","type":"string"},{"internalType":"string","name":"claimedIpfsHash","type":"string"}],"name":"mintClaimable","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"payoutContractAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"royalties","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"royaltiesBPS","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"secondaryOwnerBPS","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[4]","name":"newRoyalties","type":"address[4]"},{"internalType":"uint256[4]","name":"bps","type":"uint256[4]"}],"name":"setRoyalties","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"bps","type":"uint256"}],"name":"setSecondaryBPS","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"settleAuction","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"timePerDecrement","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"version","type":"uint256"}],"name":"updateVersion","outputs":[],"stateMutability":"nonpayable","type":"function"}];
// Mainnet Saysh Minting Contract
const contractAddress = '0xEF49e8557BDEa753a31B32B50447eC86f290cC95';
const auctionStartTime = 1634770800;
const auctionInitialEndTime = 1636761600;
// Placeholder for now, will grab from API
let ETH_TO_USD = 4400;

const blockToTimestamp = {};
const auctionSettings = {};
const bidHistory = [];

const { ethers, ethereum, fetch } = window;

fetch('https://api.easely.io/v1/exchange_rate').then(response => {
  response.json().then(exchangeRate => {
    ETH_TO_USD = exchangeRate.conversion_rate
  });
});

function userConnectedToMetamask() {
  return window.ethereum && window.ethereum.selectedAddress;
}
                     
if (!window.ethereum) {
  const bidAuction = document.getElementsByClassName("nft-auction__control-action")[0];

  bidAuction.innerHTML = "Install Metamask";
  bidAuction.onclick = () => {window.open('https://metamask.io/download.html', '_blank').focus();}
  const bidTextField = document.getElementsByClassName("nft-auction__control-auction-bid")[0];

  bidTextField.style.display = "none";
  fetchAuctionHistoryWithoutMetamask()
} else if (!userConnectedToMetamask()) {
  const bidAuction = document.getElementsByClassName("nft-auction__control-action")[0];

  bidAuction.innerHTML = "Connect Metamask";
  bidAuction.onclick = () => {window.ethereum.request({ method: 'eth_requestAccounts' })};
  // const bidTextField = document.getElementsByClassName("nft-auction__control-auction-bid")[0];
  // bidTextField.style.display = "none";

  fetchAuctionHistoryWithoutMetamask();
}

updateAuctionTime();

ethereum.on('accountsChanged', () => {
  window.location.reload();
});

ethereum.on('networkChanged', ()=> {
  window.location.reload();
});

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner()
const auctionContract =
  new ethers.Contract(contractAddress, contractABI, signer);

async function fetchAuctionHistoryWithoutMetamask() {
  const response = await fetch(`https://api.easely.io/v1/auction_history/${  TOKEN_ID}`);
  const auctionHistory = await response.json();
  let lastBid;
  let lastBidValue = "1.0";

  if (auctionHistory && auctionHistory.length) {
    lastBid = auctionHistory[auctionHistory.length-1];
    lastBidValue = convertEth(lastBid.bid_value);
  }
  
  // Update ETH Bid
  const auctionPrice = document.getElementsByClassName("nft-auction__control-price-display")[0];

  auctionPrice.innerHTML = lastBidValue;
  
  // Update USD Price
  const auctionPriceUSD = document.getElementsByClassName("nft-auction__control-info-tip")[0];
  const priceInUSD = parseFloat(lastBidValue, 10) * ETH_TO_USD;

  auctionPriceUSD.innerHTML = `$${formatNumber(priceInUSD)}`;
  
  // Update Auction end time
  if (auctionHistory && auctionHistory.length) {
    let auctionEndTimestamp = auctionInitialEndTime;

    if (lastBid.auction_end_time < auctionInitialEndTime) {
      auctionEndTimestamp = new Date(lastBid.auction_end_time).getTime() / 1000;
    }
    
    auctionSettings.endTimestamp = auctionEndTimestamp;
  } else {
    auctionSettings.endTimestamp = auctionInitialEndTime;
  }

  serializeAuctionHistoryFromAPI(auctionHistory);

  setTimeout(fetchAuctionHistoryWithoutMetamask, 15000)
}

function serializeAuctionHistoryFromAPI(auctionHistory) {
  if (!auctionHistory || bidHistory.length >= auctionHistory.length) {
    return;
  }
  const newBids = auctionHistory.slice(bidHistory.length);

  newBids.forEach((bid) => {
    const newBidRow = {
      bidder: bid.bidder_wallet_address,
      newPrice: ethers.BigNumber.from(bid.bid_value).mul(ethers.BigNumber.from("1000000000000")),
      timestamp: new Date(bid.created_at).getTime() / 1000,
    }

    bidHistory.push(newBidRow);
    renderIncomingAuctionBid(newBidRow);
  });
}

function convertEth(amount) {
  return ethers.utils.formatEther(ethers.BigNumber.from(amount).mul(ethers.BigNumber.from("1000000000000")));
}

function secondsToHMS(totalSeconds) {
  let delta = totalSeconds;
  // calculate (and subtract) whole days
  let days = Math.floor(delta / 86400);

  delta -= days * 86400;

  // calculate (and subtract) whole hours
  let hours = Math.floor(delta / 3600) % 24;

  delta -= hours * 3600;

  // calculate (and subtract) whole minutes
  let minutes = Math.floor(delta / 60) % 60;

  delta -= minutes * 60;
 

  if (days    < 10) {days    = `0${days}`;}
  if (hours   < 10) {hours   = `0${hours}`;}
  if (minutes < 10) {minutes = `0${minutes}`;}
   
  return {
    days,
    hours,
    minutes,
  };
}

function formatNumber(num) {
  return num.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
}

function isValidBid(bidString) {
  return !Number.isNaN(bidString) && !Number.isNaN(parseFloat(bidString));
}

                     
auctionContract.on("AuctionBidded", async (/* tokenId, newPrice, bidder */) => {
  // const filter = {
  //   address: contractAddress,
  //   topics: [
  //     ethers.utils.id("AuctionBidded(uint256,uint256,address)")
  //   ]
  // }
  const auctionEventFilter = auctionContract.filters.AuctionBidded();
  const events = await auctionContract.queryFilter(auctionEventFilter);
  const newBid = await serializeBidTransaction(events[events.length - 1]);

  bidHistory.unshift(newBid);
  renderIncomingAuctionBid(bidHistory[0]);
});

function renderIncomingAuctionBid(bidData) {
  const bidRow = document.createElement("div");

  bidRow.className = "nft-auction__data-line";
  
  const bidInEther = parseFloat(ethers.utils.formatEther(bidData.newPrice));
  const bidAmount = document.createElement("span");
  const bidDisplay = bidInEther.toFixed(2);

  bidAmount.innerHTML = `<b>${  bidDisplay  }</b> ETH`;
  
  const usdVal = document.createElement("span");
  const priceInUSD = parseFloat(bidInEther) * ETH_TO_USD
  
  usdVal.textContent = `$${  formatNumber(priceInUSD)}`;
  
  const bidTime = document.createElement("span");

  bidTime.textContent = new Date(bidData.timestamp*1000).toLocaleString();
  
  const walletAddress = document.createElement("span");
  const walletLink = document.createElement("a");

  walletLink.textContent = `${bidData.bidder.substring(0, 10)  }...`;
  walletLink.href = `https://etherscan.io/address/${bidData.bidder}`;
  walletAddress.appendChild(walletLink);
  
  bidRow.append(bidAmount, usdVal, bidTime, walletAddress);
  const bidHistoryContainer = document.getElementsByClassName("nft-auction__data-lines")[0];

  if (bidHistoryContainer.childElementCount === 1) {
    bidHistoryContainer.appendChild(bidRow)
  } else {
    bidHistoryContainer.insertBefore(bidRow, bidHistoryContainer.children[1]);
  }
  
}

                   
async function fetchAuctionDetails() {
  const auctionDetails = await auctionContract.getAuction(TOKEN_ID);
  const { price, endTimestamp, minBidIncrement } = auctionDetails;

  auctionSettings.price = price;
  auctionSettings.endTimestamp = Math.floor(endTimestamp.toNumber());
  const minNextBid = minBidIncrement.add(price);

  auctionSettings.minNextBid = minNextBid;
  
  const priceInEther = parseFloat(
    ethers.utils.formatEther(auctionSettings.price)
  );
  
  const auctionPrice = document.getElementsByClassName("nft-auction__control-price-display")[0];

  auctionPrice.innerHTML = priceInEther.toFixed(2);
  
  const auctionPriceUSD = document.getElementsByClassName("nft-auction__control-info-tip")[0];
  const priceInUSD = priceInEther * ETH_TO_USD;

  auctionPriceUSD.innerHTML = `$${formatNumber(priceInUSD)}`;
  
  const auctionBidField = document.getElementsByClassName("nft-auction__control-auction-bid")[0];
  const minBidInEth = ethers.utils.formatEther(auctionSettings.minNextBid);

  auctionBidField.placeholder = `Minimum Bid: ${  minBidInEth  } ETH`;
  setTimeout(fetchAuctionDetails, 3000)
}
                   
fetchAuctionDetails();

function updateAuctionTime() {
  const timeNow = new Date().getTime() / 1000;
  const submitButton = document.getElementsByClassName("nft-auction__control-action")[0];

  if (timeNow < auctionStartTime) {
    const timerHeader = document.getElementsByClassName("nft-auction__timer-tip")[0];

    timerHeader.innerHTML = "Auction begins in";
    const timeUntilAuction = auctionStartTime - timeNow;
    const { days, hours, minutes } = secondsToHMS(timeUntilAuction);
    const auctionDays = document.getElementsByClassName("nft-auction__timer-days")[0];
    const auctionHours = document.getElementsByClassName("nft-auction__timer-hours")[0];
    const auctionMinutes = document.getElementsByClassName("nft-auction__timer-minutes")[0];
  	
    auctionDays.innerHTML = days;
    auctionHours.innerHTML = hours;
    auctionMinutes.innerHTML = minutes;
    
    if (userConnectedToMetamask()) {
      submitButton.disabled = true;
      submitButton.textContent = "Auction not started";
    }
  }
  else if (auctionSettings.endTimestamp) {
    const timerHeader = document.getElementsByClassName("nft-auction__timer-tip")[0];

    timerHeader.innerHTML = "Auction ends in";
    
    const auctionTimeRemaining = auctionSettings.endTimestamp > timeNow
      ? auctionSettings.endTimestamp - timeNow : 0;

    if (auctionTimeRemaining === 0) {
      submitButton.disabled = true;
      submitButton.textContent = "Auction Ended"
      const bidTextField = document.getElementsByClassName("nft-auction__control-auction-bid")[0];

  	  bidTextField.style.display = "none";
    } else if (userConnectedToMetamask()) {
      submitButton.disabled = false;
      submitButton.textContent = "Place bid";
      const bidAuction = document.getElementsByClassName("nft-auction__control-action")[0];

      bidAuction.onclick = submitAuctionBid;
    }
    const { days, hours, minutes } = secondsToHMS(auctionTimeRemaining);
    const auctionDays = document.getElementsByClassName("nft-auction__timer-days")[0];
    const auctionHours = document.getElementsByClassName("nft-auction__timer-hours")[0];
    const auctionMinutes = document.getElementsByClassName("nft-auction__timer-minutes")[0];
  	
    auctionDays.innerHTML = days;
    auctionHours.innerHTML = hours;
    auctionMinutes.innerHTML = minutes;
    
  }
  setTimeout(updateAuctionTime, 1000);
}

function getBlockTimestamp(blockNumber) {
  return provider.getBlock(blockNumber).then((block) => {
    blockToTimestamp[blockNumber] = block.timestamp;
    return block.timestamp
  })
}

async function serializeBidTransaction(bidEvent) {
  const { args: {bidder, newPrice}, blockNumber } = bidEvent;

  if (!blockToTimestamp[blockNumber]) {
    const timestamp = await getBlockTimestamp(blockNumber);

    return {
      bidder,
      newPrice: newPrice.toString(),
      timestamp,
      blockNumber,
    }
  }
  return {
    bidder,
    newPrice: newPrice.toString(),
    timestamp: blockToTimestamp[blockNumber],
    blockNumber,
  };
};

function renderSingleAuctionBid(bidData) {
  const bidRow = document.createElement("div");

  bidRow.className = "nft-auction__data-line";
  
  const bidInEther = parseFloat(ethers.utils.formatEther(bidData.newPrice));
  const bidAmount = document.createElement("span");
  const bidDisplay = bidInEther.toFixed(2);

  bidAmount.innerHTML = `<b>${  bidDisplay  }</b> ETH`;
  
  const usdVal = document.createElement("span");
  const priceInUSD = parseFloat(bidInEther) * ETH_TO_USD

  usdVal.textContent = `$${  formatNumber(priceInUSD)}`;
  
  const bidTime = document.createElement("span");

  bidTime.textContent = new Date(bidData.timestamp*1000).toLocaleString();
  
  const walletAddress = document.createElement("span");
  const walletLink = document.createElement("a");

  walletLink.textContent = `${bidData.bidder.substring(0, 10)  }...`;
  walletLink.href = `https://etherscan.io/address/${bidData.bidder}`;
  walletAddress.appendChild(walletLink);
  
  bidRow.append(bidAmount, usdVal, bidTime, walletAddress);
  
  const bidHistoryContainer = document.getElementsByClassName("nft-auction__data-lines")[0];

  bidHistoryContainer.appendChild(bidRow);
}

function renderAuctionBids() {
  const bidHistoryContainer = document.getElementsByClassName("nft-auction__data-lines")[0];
  const numBidsRendered = bidHistoryContainer.childElementCount;

  if (!bidHistory.length || numBidsRendered >= bidHistory.length + 1) {
    setTimeout(renderAuctionBids, 2000);
    return;
  }
  bidHistory.sort((bid1, bid2) => bid2.blockNumber - bid1.blockNumber);
  bidHistory.forEach((bid) => {
    renderSingleAuctionBid(bid);
  });
}

renderAuctionBids();

async function fetchAuctionBids() {
  // const filter = {
  //   address: contractAddress,
  //   topics: [
  //     ethers.utils.id("AuctionBidded(uint256,uint256,address)")
  //   ]
  // }
  const auctionEventFilter = auctionContract.filters.AuctionBidded();
  const events = await auctionContract.queryFilter(auctionEventFilter);
  
  const filteredEvents = events.filter(
    (event) => event.args.tokenId.toNumber() === TOKEN_ID
  );

  filteredEvents.forEach(async (event) => {
    // const eventTokenId = event.args.tokenId.toNumber();
    const bidTransaction = await serializeBidTransaction(event);

    bidHistory.push(bidTransaction);
  });
}
if (userConnectedToMetamask()) {
  fetchAuctionBids();
}                  
                   
async function submitAuctionBid() {      
  const auctionBidValue = document.getElementsByClassName("nft-auction__control-auction-bid")[0].value;

  if (!isValidBid(auctionBidValue)) {
    renderBidError("Bid entered is not valid");
    return;
  }
  const bidInWei = ethers.utils.parseEther(auctionBidValue);
  const bidGreaterThanBidFloor = auctionSettings.minNextBid.lte(bidInWei);
  
  if (!bidGreaterThanBidFloor) {
    renderBidError("Bid entered is below required minimum");
    return;
  }
  const walletAddress = await signer.getAddress();
  const walletBalance = await provider.getBalance(walletAddress);
  
  if (walletBalance.lt(bidInWei)) {
    renderBidError("Insufficient funds");
    return;
  }
      
  await auctionContract.bidOnAuction(TOKEN_ID, { value: bidInWei });    
}

function renderBidError(errorMessage) {
  const auctionBidError = document.getElementsByClassName("nft-auction__control-auction-error")[0];

  auctionBidError.innerHTML = errorMessage;
}

const bidValueField = document.getElementsByClassName("nft-auction__control-auction-bid")[0];

bidValueField.onkeydown = () => {renderBidError("")}

