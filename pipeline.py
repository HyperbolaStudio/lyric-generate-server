from modelscope.pipelines import pipeline
from modelscope.utils.constant import Tasks

p = pipeline('text-generation', './model')
while(True):
    s = input('> ')
    print('\033[36m'+p(s)['text']+'\033[0m')
