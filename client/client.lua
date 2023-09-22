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