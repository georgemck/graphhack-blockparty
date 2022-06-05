const apiOpts = {};

async function mintNft() {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

    // Prompt user for account connections
    await provider.send("eth_requestAccounts", []);
    let ethereum = window.ethereum;
    let chainId = window.ethereum.chainId;


    const signer = provider.getSigner();
    console.log("Account:", await signer.getAddress());
    console.log(ethereum)
    console.log(chainId);

    const minter = new videonft.minter.FullMinter(apiOpts, { ethereum, chainId });
    const mintBtn = document.getElementById('mint-btn');

    console.log(minter);
    // let file = document.getElementById('file').files[0];
    // let file = window.livepeer.files[0];
    var imgsrcblob = document.getElementById("video-tag").src;
    var file = new File([await new Response(imgsrcblob).arrayBuffer()], "video.mp4", {type:"video/mp4"});

    // console.log('file object', document.getElementById('file'));
    let title = document.getElementById("title").value || "My NFT";
    console.log(title)
    console.log(file)
    console.log('create asset', minter.api.createAsset);
    let progressBar = document.getElementById('progress-bar')
    mintBtn.innerText = "Creating Mintable Video Asset..."

    let asset = await minter.api.createAsset(title, file, (progress) => {
        console.log('progress: ', progress)
        progressBar.style.width = `${progress * 100 }%`;
    });

    mintBtn.innerText = 'Minting....'
    console.log("asset", asset);
    // // optional, optimizes the video for the NFT
    asset = await minter.api.nftNormalize(asset);
    console.log(asset)
    const nftMetadata = {
        description: 'My NFT description',
        traits: { 'my-custom-trait': 'my-custom-value' }
    };
    console.log("metadata", nftMetadata)

    const nftInfo = await minter.createNft({
        name: title,
        file,
        nftMetadata
    });

    mintBtn.innerText = `Minted Video with ID ${nftInfo.tokenId}`;
    console.log(`minted NFT on contract ${nftInfo.contractAddress} with ID ${nftInfo.tokenId}`);
    return nftInfo;
}