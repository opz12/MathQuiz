// Формирование команды для старта игры
function getStartGameCommand() {
    return {
        type: "smart_app_data",
        smart_app_data: {
            type: "start_game"
        }
    };
}

// Формирование команды выбора сложности
function getDifficultyCommand(level) {
    return {
        type: "smart_app_data",
        smart_app_data: {
            type: "select_difficulty",
            payload: {
                level: level
            }
        }
    };
}

// Формирование команды ответа на вопрос
function getAnswerCommand(answer) {
    return {
        type: "smart_app_data",
        smart_app_data: {
            type: "answer",
            payload: {
                answer: answer
            }
        }
    };
}

// Формирование команды перезапуска игры
function getRestartCommand() {
    return {
        type: "smart_app_data",
        smart_app_data: {
            type: "restart_game"
        }
    };
}

// Формирование команды возврата в меню
function getMenuCommand() {
    return {
        type: "smart_app_data",
        smart_app_data: {
            type: "back_to_menu"
        }
    };
}
