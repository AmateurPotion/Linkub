export { default as Net } from "./Net"

// io & Server
import { createServer } from "http";
import { Server } from "socket.io"

// processes
import { Worker } from "worker_threads";
import {} from "child_process";

// console
import readline from "readline";

import { Net } from "."
import config from "Linkub/config.json";

const configList: ChildConfig[] = []
const port: number = config.port

namespace App {
    export const threads: Map<string, Worker> = new Map();
    export const server = createServer();
    export const console = Object.assign(
        readline.createInterface(
            {
              input: process.stdin,
              output: process.stdout,
            },
        ),
        { commands: new Map<string, CommandRunner>() }
    );
}

App.threads.clear();

configList.forEach(val => {
    if(val.type == "worker_threads") {
        if(val.module_type == "node") App.threads.set(val.name, new Worker(val.src + val.entry))
    }
})

App.console.setPrompt("> ");
App.console.prompt();

App.console.on("line", async commands => {
    const args: string[] = [];
    commands.split(" ").forEach(val => {
        if(val != '') args.push(val);
    });
    const command = args.shift();
    
    try {
        if(command != undefined && App.console.commands.has(command)) {
            const runner = App.console.commands.get(command) as CommandRunner;
            runner(command, args);
        }
    } catch(err) {
        console.log(err);
    } finally {
        App.console.prompt();
    }
});

App.console.on("close", function () {
    process.exit();
});

export default App;