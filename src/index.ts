import { repl } from "./repl";
import { SocketServer } from "./SocketServer";

export const instance = new SocketServer(3196);

instance.on('connected', ()=>{
    repl();
});