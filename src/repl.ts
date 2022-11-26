import readline from 'readline';
import { parseInput } from './parseInput';

const rl = readline.createInterface(process.stdin, process.stdout);

export async function repl(){
    process.stdout.write('\x1b[32mREPL started\x1b[0m\n');
    let lastResult = '';
    while(true){
        let answer = await (() => new Promise<string>((resolve, reject) => {
            rl.question('> ', (answer) => {
                resolve(answer);
            });
        }))();
        try{
            lastResult = await parseInput(answer, lastResult);
            process.stdout.write('\x1b[36m' + lastResult);
        }catch(e){
            process.stdout.write('\x1b[31m' + e);
        }finally{
            process.stdout.write('\x1b[0m\n');
        }
    }
}