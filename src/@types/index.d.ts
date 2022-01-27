declare type ChildConfig = {
    name: string
    active: boolean
    src: string,
    entry: string
} & (
    {
        type: "worker_threads"
        module_type: "node" | "other"
    } | 
    {
        type: "child_process"
        socket: boolean
        port: number
    }
)

declare type CommandRunner = (command: string, arguments: string[]) => void;