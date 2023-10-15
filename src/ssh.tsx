import { useEffect, useState } from "react";
import fs from 'fs';

export interface ISSHConnection {
  id: string;
  address: string;
  name: string;
  user?: string;
  port?: string;
  sshKey?: string;
  command?: string;
}

async function parseSSHConfig(
  configFilePath: string
): Promise<ISSHConnection[]> {
  const configData = await fs.promises.readFile(configFilePath, "utf8");
  const configLines = configData.split("\n");
  console.log("X");
  const connections: ISSHConnection[] = [];
  let currentConnection: ISSHConnection | null = null;

  for (const line of configLines) {
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith("#") || trimmedLine === "") {
      continue;
    }

    if (trimmedLine.startsWith("Host ")) {
      if (currentConnection !== null) {
        connections.push(currentConnection);
      }
      currentConnection = { id: connections.length.toString(), address: "", name: trimmedLine.substring(5), user: "" };
    } else if (currentConnection !== null) {
      const [key, value] = trimmedLine.split(/\s+/, 2);

      switch (key) {
        case "HostName":
          currentConnection.address = value;
          break;
        case "User":
          currentConnection.user = value;
          break;
        case "Port":
          currentConnection.port = value;
          break;
        case "IdentityFile":
          currentConnection.sshKey = value;
          break;
        case "HostNameKey":
          // Ignore this key
          break;
        default:
          currentConnection.name = key;
          break;
      }
    }
  }

  if (currentConnection !== null) {
    connections.push(currentConnection);
  }

  return connections;
}

const useAccounts = () => {
  const [state, setState] = useState<{
    accounts: ISSHConnection[];
    isLoading: boolean;
  }>({
    accounts: [],
    isLoading: true,
  });

  console.log("Z");

  useEffect(() => {
    (async () => {
      try {
        const accounts = await parseSSHConfig(`${process.env.HOME}/.ssh/config`);
        setState({
          accounts,
          isLoading: false,
        });
      } catch (error) {
        console.error('Error reading config file:', error);
      }
    })();
  }, []);

  return state;
};

export { useAccounts };