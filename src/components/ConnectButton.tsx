"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import {
  FaCopy,
  FaExternalLinkAlt,
  FaPowerOff,
  FaTimes,
  FaQuestionCircle,
  FaSpinner, // Import spinner icon
} from "react-icons/fa";
import { FaComputerMouse, FaWallet } from "react-icons/fa6";

// Helper functions (no changes)
const shortenAddress = (address: string) => {
  if (!address) return "";
  return `${address.substring(0, 6)}...${address.substring(
    address.length - 4
  )}`;
};

const WalletIcon = ({ connector }: { connector: any }) => {
  if (connector.icon) {
    return (
      <img
        src={connector.icon}
        alt={connector.name}
        className="h-8 w-8 rounded-lg"
      />
    );
  }
  if (connector.id === "injected")
    return <FaComputerMouse className="h-8 w-8 text-[#666666]" />;
  if (connector.id === "walletConnect")
    return <FaWallet className="h-8 w-8 text-[#666666]" />;
  return <FaWallet className="h-8 w-8 text-[#666666]" />;
};

export default function ConnectButton() {
  const { address, isConnected, chain } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // THE FIX 1: State to track which specific connector is loading
  const [pendingConnectorId, setPendingConnectorId] = useState<string | null>(
    null
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleConnect = (connector: any) => {
    setPendingConnectorId(connector.id);
    connect(
      { connector },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          setPendingConnectorId(null);
        },
        onError: () => {
          // Keep modal open on error and stop loading indicator
          setPendingConnectorId(null);
        },
      }
    );
  };

  if (!isConnected) {
    // THE FIX 2: De-duplicate connectors based on their name
    const uniqueConnectors = Array.from(
      new Map(connectors.map((c) => [c.name, c])).values()
    );
    const walletConnectConnector = uniqueConnectors.find(
      (c) => c.id === "walletConnect"
    );
    const otherConnectors = uniqueConnectors.filter(
      (c) => c.id !== "walletConnect"
    );

    return (
      <>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#FF6B6B] px-4 py-2 font-semibold text-white transition-transform hover:scale-105"
        >
          Connect Wallet
        </button>

        {isModalOpen &&
          isClient &&
          createPortal(
            <div
              className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md"
              onClick={() => setIsModalOpen(false)}
            >
              <div
                className="w-full max-w-md rounded-2xl bg-[#F7F8FC] p-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#222222]">
                    Connect a Wallet
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-[#666666] hover:text-[#222222]"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-3 gap-3">
                    {otherConnectors.map((connector) => {
                      const isLoading =
                        isPending && pendingConnectorId === connector.id;
                      return (
                        <button
                          key={connector.id}
                          onClick={() => handleConnect(connector)}
                          disabled={isLoading}
                          className="flex h-24 flex-col items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white p-2 text-center transition-all hover:border-[#FF6B6B] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isLoading ? (
                            <FaSpinner className="h-8 w-8 animate-spin text-[#FF6B6B]" />
                          ) : (
                            <WalletIcon connector={connector} />
                          )}
                          <span className="text-xs font-semibold text-[#222222]">
                            {connector.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {walletConnectConnector &&
                    (() => {
                      const isLoading =
                        isPending &&
                        pendingConnectorId === walletConnectConnector.id;
                      return (
                        <button
                          onClick={() => handleConnect(walletConnectConnector)}
                          disabled={isLoading}
                          className="flex w-full items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 text-left font-semibold text-[#222222] transition-colors hover:bg-gray-100 disabled:opacity-50"
                        >
                          {isLoading ? (
                            <FaSpinner className="h-6 w-6 animate-spin text-[#FF6B6B]" />
                          ) : (
                            <WalletIcon connector={walletConnectConnector} />
                          )}
                          <div className="flex flex-col">
                            <span>{walletConnectConnector.name}</span>
                            <span className="text-xs font-normal text-textMuted">
                              Scan with your mobile wallet
                            </span>
                          </div>
                        </button>
                      );
                    })()}
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <a
                    href="https://ethereum.org/en/wallets/find-wallet/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 text-sm text-[#666666] hover:text-[#FF6B6B]"
                  >
                    <FaQuestionCircle />
                    <span>Don't have a wallet?</span>
                  </a>
                </div>
              </div>
            </div>,
            document.body
          )}
      </>
    );
  }

  // Connected state (no changes)
  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 font-mono text-sm font-semibold text-[#222222] transition-colors hover:bg-gray-200"
      >
        {shortenAddress(address!)}
      </button>
      {isDropdownOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 origin-top-right rounded-xl border border-gray-200 bg-white p-2 shadow-lg z-50">
          <button
            onClick={() => {
              handleCopy();
              setIsDropdownOpen(false);
            }}
            className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-[#222222] hover:bg-gray-100"
          >
            <FaCopy /> {copySuccess ? "Copied!" : "Copy Address"}
          </button>
          {chain?.blockExplorers?.default.url && (
            <a
              href={`${chain.blockExplorers.default.url}/address/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm text-[#222222] hover:bg-gray-100"
            >
              <FaExternalLinkAlt /> View on Explorer
            </a>
          )}
          <div className="my-1 h-px bg-gray-200" />
          <button
            onClick={() => {
              disconnect();
              setIsDropdownOpen(false);
            }}
            className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-[#FF6B6B] hover:bg-red-50"
          >
            <FaPowerOff /> Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
