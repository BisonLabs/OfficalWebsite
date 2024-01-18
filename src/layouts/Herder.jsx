import { useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { getAddress } from "sats-connect";
import {
  connectWallet,
  disconnectWallet,
  updateWalletInfo,
} from "../store/walletActions.js";

const navigation = [
  { name: "Ecosystem", href: "https://dmaster-1.gitbook.io/bisonlabs/" },
  { name: "Bridge", href: "https://app.bisonlabs.io/bridge/" },
  { name: "Developers", href: "https://dmaster-1.gitbook.io/bisonlabs/" },
  { name: "About", href: "https://linktr.ee/bisonlabs" },
];

const Header = () => {
  const navigate = useNavigate();
  const handleClickClaim = () => {
    navigate("claim");
    window.scrollTo(0, 0);
  };

  const [modalOpen, setModalOpen] = useState(false);

  const handleClose = () => {
    setModalOpen(false); // Close the modal
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <div className="bg-white">
      <div className="py-2 mx-auto bg-amber-500  w-full h-auto ">
        <span className="max-w-screen-lg flex-wrap grid gap-3 lg:grid-cols-5 sm:grid-cols-1 items-center justify-center text-center mx-auto">
          <span className="lg:col-span-1 text-xl font-bold">ANNOUNCEMENT</span>
          <span className="lg:col-span-3">LABB Claim Will Be Available January 19th, between 4-9 PM PST</span>
          <span className="lg:col-span-1">
            <button
              className="bg-black font-sans text-amber-500 rounded-full py-2 w-48"
              onClick={handleClickClaim}
            >
              Go to Claim Page
            </button>
          </span>
        </span>
      </div>

      <header className="px-4 lg:px-12 py-4 bg-black w-full dark:border-amber-500">
        <nav
          className="flex items-center justify-between p-6 lg:px-8"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <a
              href="/"
              className="flex items-center space-x-3 rtl:space-x-reverse"
            >
              <img src="/logo.svg" className="h-10" alt="Logo" />
            </a>
          </div>

          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white hover:text-amber-500"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-lg font-sans leading-6 text-white hover:text-amber-500 font-medium"
                target="_blank"
              >
                {item.name}
              </a>
            ))}
            <button
              onClick={handleClickClaim}
              className="text-lg font-sans leading-6 text-white hover:text-amber-500 font-medium"
            >
              LABB Token Claim
            </button>
          </div>

          {/* <div className="hidden lg:flex lg:justify-end ml-10">
            {!ordinalsAddress && (
              <button
                onClick={() => setModalOpen(true)}
                className="bg-amber-500 font-sans text-black rounded-full py-1 w-28 font-bold"
                type="button"
              >
                Connect
              </button>
            )}
            {ordinalsAddress && (
              <button
                onClick={() => setModalOpen(true)}
                className="bg-amber-500 font-sans text-black rounded-full py-1 w-28 font-bold"
                type="button"
              >
                {formatAddress(ordinalsAddress)}
              </button>
            )}
          </div> */}
        </nav>

        <Dialog
          as="div"
          className="lg:hidden"
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
        >
          <div className="fixed inset-0 z-50" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-amber-300 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a
                href="/"
                className="flex items-center space-x-3 rtl:space-x-reverse"
              >
                <img src="/logo.svg" className="h-10" alt="Logo" />
              </a>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-amber-500"
                      target="_blank"
                    >
                      {item.name}
                    </a>
                  ))}
                  {/* <a
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-amber-500 cursor-pointer"
                    onClick={handleClickClaim}
                  >
                    LABB Token Claim
                  </a> */}
                </div>
                {/* <div className="py-6">
                  <button
                    onClick={() => setModalOpen(true)}
                    className="bg-amber-500 font-sans text-black rounded-md py-4 w-48 text-lg font-bold"
                    type="button"
                  >
                    Connect
                  </button>
                </div> */}
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </header>

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
                <button>
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

// const mapStateToProps = (state) => ({
//   connected: state.connected,
//   address: state.address,
// });

// const mapDispatchToProps = {
//   connectWallet,
//   disconnectWallet,
//   updateWalletInfo,
// };

// export default connect(mapStateToProps, mapDispatchToProps)(Header);

export default Header;
