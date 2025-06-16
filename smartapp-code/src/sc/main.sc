require: /js/utils.js

theme: /
    state: Start
        q!: $regex</start>
        a: Привет! Скажите 'начать игру' или выберите сложность: легкий, средний или сложный

    state: runApp
        q!: * *start
        q!: (запусти | вруби | открой) Math (Quiz | квиз)
        event!: runApp
        a: Привет! Скажите 'начать игру' или выберите сложность: легкий, средний или сложный
        script: 
            $jsapi.log("runApp");

    state: StartGame
        q!: начать игру 
        a: Начинаем! Только перед этим выберите сложность
        script:
            $jsapi.log("StartGame");
            $response.replies = $response.replies || [];
            $response.replies.push({
                type: 'raw',
                body: {
                    items: [{ command: getStartGameCommand() }]
                }
            });


    state: EasyDifficulty
        q!: (легкий | легкая | простой)
        a: Хорошо, пора размять мозги 
        script:
            $jsapi.log("Выбор сложности: easy");
            var level = "easy";
            $response.replies = $response.replies || [];
            $response.replies.push({
                type: 'raw',
                body: {
                    items: [{ command: getDifficultyCommand(level) }]
                }
            });

    state: MediumDifficulty
        q!: (средний)
        a: Хорошо, сложность установлена
        script:
            $jsapi.log("Выбор сложности: medium");
            var level = "medium";
            $response.replies = $response.replies || [];
            $response.replies.push({
                type: 'raw',
                body: {
                    items: [{ command: getDifficultyCommand(level) }]
                }
            });

    state: HardDifficulty
        q!: (сложный | тяжелый)
        a: Хорошо, но будет непросто
        script:
            $jsapi.log("Выбор сложности: hard");
            var level = "hard";
            $response.replies = $response.replies || [];
            $response.replies.push({
                type: 'raw',
                body: {
                    items: [{ command: getDifficultyCommand(level) }]
                }
            });

    state: AnswerFirst
        q!: (первый | один | 1)
        a: Хорошо, ответ установлен
        script:
            $jsapi.log("Ответ 1");
            var answer = 1;
            $response.replies = $response.replies || [];
            $response.replies.push({
                type: 'raw',
                body: {
                    items: [{ command: getAnswerCommand(answer) }]
                }
            });
    state: AnswerSecond
        q!: (второй | два | 2)
        a: Хорошо, будет учтено
        script:
            $jsapi.log("Ответ 2");
            var answer = 2;
            $response.replies = $response.replies || [];
            $response.replies.push({
                type: 'raw',
                body: {
                    items: [{ command: getAnswerCommand(answer) }]
                }
            });

    state: AnswerThird
        q!: (третий | три | 3)
        a: Хорошо, ответ принят
        script:
            $jsapi.log("Ответ 3");
            var answer = 3;
            $response.replies = $response.replies || [];
            $response.replies.push({
                type: 'raw',
                body: {
                    items: [{ command: getAnswerCommand(answer) }]
                }
            });

    state: AnswerFourth
        q!: (четвертый | четыре | 4)
        a: Хорошо, я запомню
        script:
            $jsapi.log("Ответ 4");
            var answer = 4;
            $response.replies = $response.replies || [];
            $response.replies.push({
                type: 'raw',
                body: {
                    items: [{ command: getAnswerCommand(answer) }]
                }
            });

    state: RestartGame
        q!: (заново | сначала | снова | еще раз)
        q!: (перезапусти | рестарт)
        a: Хорошо, сейчас
        script:
            $response.replies = $response.replies || [];
            $response.replies.push({
                type: 'raw',
                body: {
                    items: [{ command: getRestartCommand() }]
                }
            });

    state: Help
        q!: Помощь
        a: Хорошо, вот доступные команды
        script: 
            $response.replies = $response.replies || [];
            $response.replies.push({
                type: 'raw',
                body: {
                    items: [{ command: getHelpCommand() }]
                }
            });

    state: Fallback
        event!: noMatch
        a: Извините, я вас не понимаю. Попробуйте сказать "Помощь", чтобы узнать, какие команды доступны