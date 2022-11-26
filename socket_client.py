from modelscope.pipelines import pipeline
from modelscope.utils.constant import Tasks

pk = pipeline('text-generation', './models/k')
pp = pipeline('text-generation', './models/p')

import socket
import sys
from typing import Dict, Callable

def start_socket(handlers: Dict[str, Callable[[str], str]]):
    client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client.connect(('localhost', int(sys.argv[1])))
    while(True):
        data = client.recv(1024)
        if(not data):
            break
        (id, handler, request) = data.decode('utf-8').split('\n')
        try:
            client.sendall(bytes('\n'.join([id, '0', handlers[handler](request)]), 'utf-8'))
        except Exception as e:
            client.sendall(bytes('\n'.join([id, '1', repr(e)]), 'utf-8'))

start_socket({
    'k': lambda s: pk(s)['text'],
    'p': lambda s: pp(s)['text'],
})
