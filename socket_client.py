from modelscope.pipelines import pipeline
from modelscope.utils.constant import Tasks

p = pipeline('text-generation', './model')

import socket
import sys
client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
client.connect(('localhost', int(sys.argv[1])))

while(True):
    data = client.recv(1024)
    if(not data):
        break
    (id, request) = data.decode('utf-8').split('\n')
    client.sendall(bytes(id+'\n'+p(request)['text'], 'utf-8'))
