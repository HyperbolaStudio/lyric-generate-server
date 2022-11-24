import net from 'net';
import child_process from 'child_process';
import stream from 'stream';
import EventEmitter from 'events';
export class SocketClient extends EventEmitter{
    private pythonProcess;
    private server = net.createServer();
    private socket?: net.Socket;
    constructor(port: number){
        super();
        this.server.listen(port, '127.0.0.1');
        this.server.maxConnections = 1;
        this.pythonProcess = child_process.spawn('python',['socket_client.py', port.toString()],{
            stdio: 'inherit'
        });
        this.server.on('connection', (socket)=>{
            this.socket = socket;
            this.emit('connected');
        });
    }
    pipeline(request: string){
        return new Promise<string>((resolve,reject)=>{
            if(!this.socket){
                reject(`Client is still pending.`);
            }else{
                try{
                    let id = Math.random().toString();
                    this.socket.write(id+'\n'+request);
                    this.socket.on('data', (data)=>{
                        let [idRecv, response] = data.toString().split('\n');
                        if(idRecv == id){
                            resolve(response);
                        }
                    });
                }catch(e){
                    reject(e);
                }
            }
        });
    }
}
