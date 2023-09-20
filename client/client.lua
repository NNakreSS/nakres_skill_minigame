successFunc, failFunc, halfFunc = nil, nil, nil
miniGame = {
    Active = false,
}

miniGame.Start = function(data, scFunc, flFunc, halfscFunc)
    if not miniGame.Active then
        displayMinigame(data);
        successFunc = scFunc and scFunc or nil;
        failFunc = flFunc and flFunc or nil;
        halfFunc = halfscFunc and halfscFunc or nil;
    else
        print('Zaten birşeylerle meşgulsün')
    end
end

miniGame.Stop = function()
    displayMinigame()
end

function displayMinigame(data)
    miniGame.Active = not miniGame.Active;
    SetNuiFocus(miniGame.Active, miniGame.Active);
    if miniGame.Active then
        SendNUIMessage({
            type = "start",
            data = data,
        })
    else
        SendNUIMessage({
            type = "stop",
        })
    end
end

RegisterNUICallback('endGame', function(endType)
    miniGame.Stop();
    if endType == "success" then
        success, result = pcall(function()
            successFunc()
        end)
    elseif endType == "halfSuccess" then
        success, result = pcall(function()
            halfFunc()
        end)
    else
        success, result = pcall(function()
            failFunc()
        end)
    end
    if not success then
        print(result)
    end
end)

function GetMiniGame()
    return miniGame
end

exports("GetMiniGame", GetMiniGame)


function helalknk()
    print("helal len ")
end

RegisterCommand("testMiniGame", function()
    miniGame.Start({
            -- difficultyFactor = 0.98,
            -- lineSpeedUp = 1,
            time = 30,
            -- halfSuccessMin = 70,
            valueUpSpeed = 1,
            -- valueDownSpeed = 0.3,
            -- areaMoveSpeed = "0.5",
            -- img = "img/fire.webp",
            -- areaColor = "red",
        },
        function()
            helalknk()
        end,
        function()
            print("beceremedinla")
        end
    )
end)
