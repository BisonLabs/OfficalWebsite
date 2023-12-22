import React, { useEffect, useRef, useState } from "react";
import ClaimBox from "../../components/ClaimBox";
import { getAddress } from "sats-connect";
import { connect } from "react-redux";
// import { connectWallet, disconnectWallet, updateWalletInfo } from "../../store/walletActions.js";

const LabbClaim = () => {
  // Content
  const Content = () => {
    // ...
    const [btcBalance, setBtcBalance] = useState(0);
    const [beClaimedAmount, setBeClaimedAmount] = useState(0);
    const [totalClaimedAmount, setTotalClaimedAmount] = useState(0);
    const totalClaimedAmountRef = useRef(totalClaimedAmount);
    const [claimStatusMessage, setClaimStatusMessage] = useState("");
    const claimStatusMessageStyle =
      claimStatusMessage === "Congratulations on your claim!"
        ? "text-sm text-center text-green-600"
        : "text-xs text-center";

    useEffect(() => {
      totalClaimedAmountRef.current = totalClaimedAmount;
    }, [totalClaimedAmount]);

    const [ordinalsAddress, setOrdinalsAddress] = useState("");
    const [paymentAddress, setPaymentAddress] = useState("");
    const [ordinalsPublicKey, setOrdinalsPublicKey] = useState("");
    const [paymentPublicKey, setPaymentPublicKey] = useState("");
    const [NETWORK, setNetwork] = useState("Mainnet");
    const [claim_endpoint, setClaim_endpoint] = useState(
      " https://app.bisonlabs.io/labb_endpoint"
    );

    // Modal setting
    const [modalOpen, setModalOpen] = useState(false);
    const handleClose = () => {
      setModalOpen(false); // Close the modal
    };

    // Handel Deposite setting
    const handleDepositeAmountChange = (event) => {
      const value = parseFloat(event.target.value);
      if (value >= 0) {
        // Only update the state if the value is non-negative
        setTotalClaimedAmount(value);
      }
    };
    const handleMaxDeposite = () => {
      const maxAmount = Math.max(btcBalance - 0.0001, 0);
      setTotalClaimedAmount(maxAmount);
    };

    // Connect Wallet Button Click
    const onConnectClick = async () => {
      // if (ordinalsAddress != "") {
      //   checkClaim();
      //   return;
      // }
      const getAddressOptions = {
        payload: {
          purposes: ["ordinals", "payment"],
          message: "Address for receiving Ordinals",
          network: {
            type: NETWORK,
          },
        },
        onFinish: async (response) => {
          setOrdinalsAddress(response.addresses[0].address);
          setPaymentAddress(response.addresses[1].address);
          setOrdinalsPublicKey(response.addresses[0].publicKey);
          setPaymentPublicKey(response.addresses[1].publicKey);
          checkClaim(response.addresses[0].address);
          handleClose();
        },
        onCancel: () => alert("Request Cancel"),
      };

      await getAddress(getAddressOptions);
      // 如果您有fetchContracts函数，请取消下面这行的注释
      // this.fetchContracts();
      // connectWallet(ordinalsAddress, ordinalsPublicKey);
      // updateWalletInfo(ordinalsAddress, ordinalsPublicKey);
    };

    // Disconnect Wallet Button Click
    const onDisconnectClick = () => {
      setPaymentAddress(undefined);
      setPaymentPublicKey(undefined);
      setOrdinalsAddress(undefined);
      setOrdinalsPublicKey(undefined);
      checkClaim();
      setClaimStatusMessage("");
    };

    // Claim Click
    const onClaimClick = async () => {
      if (!ordinalsAddress) {
        alert("Please Connect Wallet First"); // 或者使用更高级的弹窗提示
        return;
      }
      const payload = {
        token: "labb",
        address: ordinalsAddress,
      };
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      };
      const response = await fetch(`${claim_endpoint}/claim`, requestOptions);
      const responseData = await response.json();

      alert(responseData.message);

      await checkClaim(ordinalsAddress);
      console.log(
        "Previous totalClaimedAmount:",
        totalClaimedAmountRef.current
      );
      console.log("Current totalClaimedAmount:", totalClaimedAmount);

      if (totalClaimedAmount > totalClaimedAmountRef.current) {
        setClaimStatusMessage("Congratulations on your claim!");
      }
      if (totalClaimedAmount == totalClaimedAmountRef.current) {
        setClaimStatusMessage(
          "You have no more to claim. Join our Discord to find out how you can earn more $LABB tokens!"
        );
      }
    };

    // Check Claim
    const checkClaim = async (address) => {
      const payload = {
        token: "labb",
        address: address,
      };
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      };
      const response = await fetch(`${claim_endpoint}/query`, requestOptions);
      const responseData = await response.json();
      setBeClaimedAmount(responseData.beClaimedAmount / 100000000);
      setTotalClaimedAmount(responseData.totalClaimedAmount / 100000000);

      console.log("checkClaim responseData: ", responseData);
    };

    // Wallet Address Format
    const formatAddress = (address) => {
      if (!address) return "";
      return `${address.slice(0, 8)}...${address.slice(-8)}`;
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="mt-14">
          <div className="block lg:flex justify-center md:justify-start align-center">
            <img
              src="img/logo/btclab.png"
              className="w-[60%] sm:w-[40%] md:w-[40%] mb-5"
            />
            <img
              src="img/logo/logo.png"
              className="w-[60%] sm:w-[40%] md:w-[40%] mb-5"
            />
          </div>
          <p className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-white font-medium mt-4">
            OFFICIAL
          </p>
          <p className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-white font-medium">
            LABB TOKEN Claim
          </p>
          <div className="md:pr-24">
            <p className="mt-4">
              Calling all approved Entrepreneurs! See how many free LABB tokens
              you are eligible to claim!
            </p>
            <div className="h-0 border-t-2 border-white my-5"></div>
            <p className="text-3x1">
              If you have not yet been approved please fill out our form to be
              considered for the claim.
            </p>
          </div>
          <a href="https://btcstartuplab.info/LABBWL" target="_blank">
            <button className=" bg-amber-500 text-black font-bold border-solid border-white  hover:bg-white hover:text-black rounded-full transition duration-300 ease-in-out mt-5 px-8 py-2">
              Submit Form Here
            </button>
          </a>
        </div>

        <div className="flex justify-center">
          <ClaimBox ixBackground={true}>
            {!ordinalsAddress && (
              <div className="text-center text-sm text-gray-400 p-4">
                Connect your wallet to see how much LABB you are eligible to
                claim
              </div>
            )}
            {ordinalsAddress && (
              <div className="text-center text-sm ">
                <p className="text-gray-400 p-4">Connected</p>
                <p className="text-yellow-500">
                  {formatAddress(ordinalsAddress)}
                </p>
              </div>
            )}

            <div className="mt-5">
              <label
                style={{ color: "white" }}
                id="listbox-label"
                className="block text-sm font-medium text-gray-700"
              >
                {" "}
                Amount to be Claimed{" "}
              </label>
              <div className="mt-1 relative">
                <button
                  style={{ height: "50px" }}
                  type="button"
                  className="flex justify-between items-center w-full  bg-black border border-gray-300 rounded-md shadow-sm px-3 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  aria-haspopup="listbox"
                  aria-expanded="true"
                  aria-labelledby="listbox-label"
                >
                  <button className="cursor-default border border-gray-300 rounded-md shadow-sm pr-3 py-1">
                    <span className="flex items-center">
                      <img
                        src="/img/menuImages/smallmark-icon.svg"
                        alt=""
                        className="flex-shrink-0 h-6 w- rounded-full"
                      />
                      <span
                        style={{ color: "white" }}
                        className="ml-3 block truncate"
                      >
                        {" "}
                        LABB{" "}
                      </span>
                    </span>
                  </button>

                  <span className="ml-3 absolute text-white inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    {beClaimedAmount}
                  </span>
                </button>
              </div>
            </div>

            <div className="mt-5">
              <label
                style={{ color: "white" }}
                id="listbox-label"
                className="block text-sm font-medium text-gray-700"
              >
                {" "}
                Total Claimed{" "}
              </label>

              <div className="mt-1 relative">
                <button
                  style={{ height: "50px" }}
                  type="button"
                  className="flex justify-between items-center w-full bg-black border border-gray-300 rounded-md shadow-sm px-3 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  aria-haspopup="listbox"
                  aria-expanded="true"
                  aria-labelledby="listbox-label"
                >
                  <button className="cursor-default border border-gray-300 rounded-md shadow-sm pr-3 py-1">
                    <span className="flex items-center">
                      <img
                        src="/img/menuImages/smallmark-icon.svg"
                        alt=""
                        className="flex-shrink-0 h-6 w- rounded-full"
                      />
                      <span
                        style={{ color: "white" }}
                        className="ml-3 block truncate"
                      >
                        {" "}
                        LABB{" "}
                      </span>
                    </span>
                  </button>
                  <span className="ml-3 absolute text-white inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    {totalClaimedAmount}
                  </span>
                </button>
              </div>
            </div>

            <div
              className="flex justify-center mt-2"
              style={{ textAlign: "right" }}
            >
              {!ordinalsAddress && (
                <button
                  onClick={() => setModalOpen(true)}
                  className=" bg-black text-amber-500 border-white border hover:bg-amber-500 hover:text-black rounded-full transition duration-300 ease-in-out my-10 px-8 py-2 w-full text-sm"
                >
                  Connect Wallet to Claim
                </button>
              )}
              {ordinalsAddress && (
                <div className="w-full">
                  <button
                    onClick={onClaimClick}
                    className=" bg-black text-amber-500 border-white border hover:bg-amber-500 hover:text-black rounded-full transition duration-300 ease-in-out mt-10 mb-5 px-8 py-2 w-full text-sm"
                  >
                    Claim
                  </button>
                  <p className={claimStatusMessageStyle}>
                    {claimStatusMessage}
                  </p>
                  <button
                    onClick={onDisconnectClick}
                    className=" bg-black text-amber-500 border-white border hover:bg-amber-500 hover:text-black rounded-full transition duration-300 ease-in-out mt-5 px-8 py-2 w-full text-sm"
                  >
                    Disconnect
                  </button>
                </div>
              )}
            </div>
          </ClaimBox>
        </div>
        {/* {modalOpen && (
          <div
            id="static-modal"
            data-modal-backdrop="static"
            tabIndex="-1"
            aria-hidden="true"
            className="fixed top-0 right-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50 text-white "
          >
            <div className="relative p-4 w-full max-w-2xl border border-white rounded-3xl bg-black">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  className="text-white bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-12 h-8 ms-auto inline-flex justify-center items-center  "
                  onClick={handleClose}
                >
                  Close
                </button>
              </div>

              <div className="text-white font-sans text-center">
                <p className="text-3xl my-5">Connect your Xverse Wallet</p>
                <div className="flex justify-center flex-col items-center">
                  <button
                    onClick={onConnectClick}
                    className="flex justify-center items-center border border-white rounded-3xl px-5 my-5"
                  >
                    <img
                      src="/svg/xverse-wallet.svg"
                      alt="Connect-Logo"
                      className="h-24"
                    />
                    <p className="text-8xl font-medium pb-4">verse</p>
                  </button>
                  <button className="flex justify-center items-center border border-white rounded-3xl px-5 my-5">
                    <img
                      src="/svg/unisat-wallet.svg"
                      alt="Connect-Logo"
                      className="h-24"
                    />
                    <p className="text-5xl">UniSat</p>
                  </button>
                </div>
                <p className="text-sm py-5">
                  Click to connect of create Xverse wallet
                </p>
              </div>
            </div>
          </div>
        )} */}

        {modalOpen && (
          <div
            id="static-modal"
            data-modal-backdrop="static"
            tabIndex="-1"
            aria-hidden="true"
            className="fixed top-0 right-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50 text-white "
          >
            <div className="relative p-4 w-full max-w-2xl border border-white rounded-3xl bg-black">
              <div className="flex items-center justify-between p-4 md:p-5">
                <button
                  type="button"
                  className="text-white bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-12 h-8 ms-auto inline-flex justify-center items-center  "
                  onClick={handleClose}
                >
                  Close
                </button>
              </div>

              <div className="text-white font-sans text-center">
                <p className="text-3xl pb-16">Connect your Xverse Wallet</p>
                <div className="flex justify-center">
                  <button onClick={onConnectClick}>
                    <img
                      src="/svg/connection-icon.svg"
                      alt="Connect-Logo"
                      className="h-24 border border-white px-4 py-8 rounded-3xl"
                    />
                  </button>
                </div>
                <p className="text-sm py-10">
                  Click to connect of create Xverse wallet
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // More info
  const MoreInfo = () => {
    return (
      <div>
        <div className=" text-white mx-12 sm:mx-16 md:mx-28 lg:mx-60 py-20">
          <div className="text-center text-3xl font-medium ">
            Having Difficulties or Would Like
            <br />
            More Information?
          </div>
          <div className="text-center font-medium my-4">
            Contact us at btcstartuplab.com or click the button below!
          </div>
          <div className="flex justify-center items-center">
            <a href="/">
              <button className=" bg-yellow-600 text-black font-bold border-solid border-white  hover:bg-white hover:text-black rounded-full transition duration-300 ease-in-out mt-5 px-8 py-2">
                Click for more info!
              </button>
            </a>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4">
      <Content />
      <MoreInfo />
    </div>
  );
};

// const mapStateToProps = (state) => ({
//   connected: state.connected,
//   address: state.address,
// });

// const mapDispatchToProps = {
//   connectWallet,
//   disconnectWallet,
// };

// export default connect(mapStateToProps, mapDispatchToProps)(LabbClaim);

export default LabbClaim;
