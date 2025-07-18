"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { walletConnectConnector } from "../lib/wagmiConfig";

export default function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, error, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = (connector: any) => {
    connect({ connector });
  };

  return (
    <div>
      {isConnected ? (
        <div className="flex flex-col items-center gap-2">
          <p>Connected: {address}</p>
          <button
            onClick={() => disconnect()}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {connectors.map((connector) => (
            <button
              key={connector.id}
              onClick={() => handleConnect(connector)}
              disabled={isPending}
              className={`px-4 py-2 rounded text-white ${
                connector.id === "injected"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-blue-600 hover:bg-blue-700"
              } ${isPending ? "opacity-50" : ""}`}
            >
              {isPending ? "Connecting..." : `Connect ${connector.name}`}
            </button>
          ))}
          {error && <p className="text-red-500">Error: {error.message}</p>}
        </div>
      )}
    </div>
  );
}
