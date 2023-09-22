fx_version 'cerulean'
game 'gta5'

name "nakres_skillminigame"
description "Skillbar minigame"
author "NakreS"
version "1.0.0"

client_script 'client/client.lua'

ui_page 'ui/index.html'

files {
    "ui/**",
}

-- dependency ''

lua54 'yes'

-- data : difficultyFactor , lineSpeedUp , time , halfSuccessMin , valueUpSpeed , valueDownSpeed , areaMoveSpeed , img ;
