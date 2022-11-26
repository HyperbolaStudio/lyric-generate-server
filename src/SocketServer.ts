import net from 'net';
import child_process from 'child_process';
import stream from 'stream';
import EventEmitter from 'events';
export class SocketServer extends EventEmitter{
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

    on(eventName: 'connected', listener: ()=>void): this;
    on(event: string, listener: (...args: any[]) => void): this;
    on(event: string, listener: (...args: any[]) => void){
        return super.on(event, listener);
    }

    pipeline(handler: string, request: string){
        return new Promise<string>((resolve,reject)=>{
            if(!this.socket){
                reject(`Client is still pending.`);
            }else{
                try{
                    let id = Math.random().toString();
                    this.socket.write([id, handler, request].join('\n'));
                    this.socket.once('data', (data)=>{
                        let [idRecv, status, response] = data.toString().split('\n');
                        if(idRecv == id){
                            if(status == '0')resolve(response);
                            else if(status == '1')reject(response);
                        }
                    });
                }catch(e){
                    reject(e);
                }
            }
        });
    }
}
