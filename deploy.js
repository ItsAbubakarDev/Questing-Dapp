async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const Token = await ethers.getContractFactory("QuestingToken");
    const token = await Token.deploy();
    await token.deployed();
    console.log("Token deployed to:", token.address);

    const NFT = await ethers.getContractFactory("QuestingNFT");
    const nft = await NFT.deploy();
    await nft.deployed();
    console.log("NFT deployed to:", nft.address);

    const Questing = await ethers.getContractFactory("Questing");
    const questing = await Questing.deploy(token.address, nft.address);
    await questing.deployed();
    console.log("Questing contract deployed to:", questing.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
