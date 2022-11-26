import { instance } from ".";

export async function parseInput(input: string, lastResult: string){
    let commandRequestParser: {[p: string]: (...args: string[])=>string} = {
        p(...args){
            return args.join('\t');
        },
        k(...args){
            return args.map(v=>{
                if(/^\[\d+\]$/.test(v)){
                    return (new Array<string>(parseInt(v.slice(1, v.length-1)))).fill('');
                }else{
                    return v;
                }
            }).flat().join('/');
        },
        e(){
            process.exit();
        }
    }
    let [command, ...args] = input.split(' ').filter(v=>v);
    args = args.map(v => v=='_' ? lastResult:v);
    if(Object.getOwnPropertyNames(commandRequestParser).includes(command)){
        let request = commandRequestParser[command](...args);
        return await instance.pipeline(command, request);
    }else{
        throw new Error(`Unknown command: ${command}`);
    }
}