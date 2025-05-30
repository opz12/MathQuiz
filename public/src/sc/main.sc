require: /js/utils.js

patterns:
    $Difficulties = 
        (легкий | легкая | простой | первый): easy
        (средний | вторая | второй): medium
        (сложный | тяжелый | третий): hard
        
    $AnswerNumber = 
        (первый | один | 1): 1
        (второй | два | 2): 2
        (третий | три | 3): 3
        (четвертый | четыре | 4): 4

theme: /
    state: Start
        q!: (запусти | начни | открой) квиз
        q!: (запусти | начни | открой) математический квиз
        q!: (начать | старт) игру
        script:
            $response.replies = [{
                type: 'raw',
                body: {
                    items: [{ command: getStartGameCommand() }]
                }
            }];

    state: SelectDifficulty
        q!: $Difficulties::level
        script:
            var level = $parseTree._level;
            $response.replies = [{
                type: 'raw',
                body: {
                    items: [{ command: getDifficultyCommand(level) }]
                }
            }];

    state: AnswerQuestion
        q!: $AnswerNumber::answer
        script:
            var answer = $parseTree._answer;
            $response.replies = [{
                type: 'raw',
                body: {
                    items: [{ command: getAnswerCommand(answer) }]
                }
            }];

    state: RestartGame
        q!: (заново | сначала | снова | еще раз)
        q!: (перезапусти | рестарт)
        script:
            $response.replies = [{
                type: 'raw',
                body: {
                    items: [{ command: getRestartCommand() }]
                }
            }];

    state: BackToMenu
        q!: (главное | основное) меню
        q!: (назад | выйти | отмена)
        script:
            $response.replies = [{
                type: 'raw',
                body: {
                    items: [{ command: getMenuCommand() }]
                }
            }];

    state: Fallback
        event!: noMatch
        a: Извините, я не понял. Попробуйте сказать "начать игру".
