import { useEffect, useState } from "react";
import { ChildProcess, exec } from "child_process";
import { shellEnv } from "shell-env";

interface EnvType {
    env: Record<string, string>;
    cwd: string;
    shell: string;
}

let cachedEnv: null | EnvType = null;

const getCachedEnv = async () => {
    if (cachedEnv) {
        return cachedEnv;
    }

    try {
        const env = await shellEnv();
    
        cachedEnv = {
          env: env,
          cwd: env.HOME || `/Users/${process.env.USER}`,
          shell: env.SHELL,
        };
        return cachedEnv;
      } catch (error) {
        console.error("Failed to fetch shell environment:", error);
        return {
          env: {},
          cwd: "",
          shell: "",
        };
      }
};

const Test = ({ cmd }: { cmd: string }) => {
    const [output, setOutput] = useState<string>("");
    const [finished, setFinished] = useState<boolean>(false);

    console.log("A", cmd);

    useEffect(() => {
        let killed = false;
        let child: ChildProcess | null = null;

        const runCommand = async () => {
            const execEnv = await getCachedEnv();
            child = await exec(cmd, execEnv);
            child.stderr?.on("data", (data: string) => {
                if (killed) {
                    return;
                }
                setOutput((out) => `${out}${data}`);
            });
            child.stdout?.on("data", (data: string) => {
                if (killed) {
                    return;
                }
                setOutput((out) => `${out}${data}`);
            });
            child.on("exit", () => {
                console.log(0)
                if (killed) {
                    console.log(1)
                    return;
                }
                console.log(2)
                setFinished(true);
            });
            /*child.on('close', (code) => {
                console.log(`child process exited with code ${code}`);
            });*/

            /*child.on('error', (err) => {
                console.error(`Failed to start subprocess. ${err}`);
            }); */
        };
        runCommand();

        return function cleanup() {
            killed = true;
            console.log(3)
            if (child !== null) {
                console.log(4)
                child.kill("SIGTERM");
            }
        };
    }, [cmd, setOutput, setFinished]);

    return { output, finished };
}

export { Test };