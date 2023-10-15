import { useEffect, useState } from "react";
import { Icon, MenuBarExtra, Clipboard, showToast, Toast } from "@raycast/api";
import { getFavicon } from "@raycast/utils";

import { useAccounts } from './ssh';
import { Test } from './test';

export default function Command() {
  const { accounts, isLoading } = useAccounts();
  
  const { output, finished } = Test({ cmd: "node -v" });
  console.log("-", output, finished);

  async function test() {
  }

  useEffect(() => {
    //test();
  }, []);

  return (
    <MenuBarExtra icon={Icon.Bookmark} isLoading={isLoading}>
      {accounts.length === 0 ? (
        <MenuBarExtra.Item title="No accounts" />
      ) : (
        accounts.map((account, i) => (
          <MenuBarExtra.Submenu
            key={account.name}
            icon={getFavicon('https://' + account.address)}
            title={account.name.split('-')[1]}
          >
            <MenuBarExtra.Item
              title="Select dir"
              //onAction={() => console.log("account")}
              onAction={() => test()}
            />
            <MenuBarExtra.Item
              title="~/Desktop"
              //onAction={() => gitClone(account.name.split('-')[1])}
            />
          </MenuBarExtra.Submenu>
        ))
      )}
    </MenuBarExtra>
  );
}

/*
  function getUserNameAndProject(url: string): { userName: string | undefined, projectName: string | undefined } {
    const regex = /^(?:https:\/\/github\.com\/|git@github\.com:)([^/]+)\/([^/]+)\.git$/;
    const match = url.match(regex);

    if (!match) return { userName: undefined, projectName: undefined };
    const userName = match[1];
    const projectName = match[2];
    return { userName, projectName };
  }

  async function gitClone(name: string) {
    const { text } = await Clipboard.read();
    const { userName, projectName } = getUserNameAndProject(text);
    if (userName !== undefined) {
      const cmd = `cd $HOME/Desktop && git clone --progress git@github.com-${name}:${userName}/${projectName}.git && cd ${projectName} && code .`;
      //const { stdout, stderr } = await exec(cmd);
      //if (stderr) throw new Error(stderr);
      //console.log(stdout.trim().split("\n"));
    } else {
      await showToast({
        style: Toast.Style.Failure,
        title: "Invalid url",
        message: "Invalid url",
      });
    }
  }
*/