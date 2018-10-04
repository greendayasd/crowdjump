import json, os, time, datetime
from django.contrib.auth import authenticate, login, logout
from authentication.models import Account, GameInfo
from authentication.permissions import IsAccountOwner
from authentication.serializers import AccountSerializer, AccountSerializerPrivate
from rest_framework.response import Response
from rest_framework import status, permissions, viewsets, views
from django.http import JsonResponse, HttpResponseForbidden, HttpResponseRedirect
from website.models import Version
from authentication.forms import ImageUploadForm
from django.shortcuts import render
from django.contrib.staticfiles.templatetags.staticfiles import static
from django.views.decorators.csrf import csrf_exempt
import math
from django.db.models import Sum, Avg, Max, Min, FloatField, Count, Q

class AccountViewSet(viewsets.ModelViewSet):
    lookup_field = 'username'
    queryset = Account.objects.all()
    serializer_class = AccountSerializer

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return (permissions.AllowAny(),)

        if self.request.method == 'POST':
            return (permissions.AllowAny(),)

        return (permissions.IsAuthenticated(), IsAccountOwner(),)

    def create(self, request):
        serializer = self.serializer_class(data=request.data, context={'request': request})

        if serializer.is_valid():
            Account.objects.create_user(**serializer.validated_data)

            return Response(serializer.validated_data, status=status.HTTP_201_CREATED)

        return Response({
            'status': 'Bad request',
            'message': 'Account could not be created with received data.'
        }, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, format=None):
        users = Account.objects.all()

        serializer = AccountSerializerPrivate(users, many=True, context={'request': request})
        return Response(serializer.data)


class LoginView(views.APIView):
    def post(self, request, format=None):
        data = json.loads(request.body)

        email = data.get('email', None)
        password = data.get('password', None)
        # email = 'test6@test6.com'
        # username = 'test6'
        # password = 'asdasd123'

        account = authenticate(email=email, password=password)

        if account is not None:
            if account.is_active:
                login(request, account)

                serialized = AccountSerializer(account)

                return Response(serialized.data)
            else:
                return Response({
                    'status': 'Unauthorized',
                    'message': 'This account has been disabled.'
                }, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({
                'status': 'Unauthorized',
                'message': 'Email ' + email + '  password  ' + password + ' combination invalid.'
            }, status=status.HTTP_401_UNAUTHORIZED)


def RefreshAccount(request):
    if request.user.is_authenticated:
        userid = request.user.id
    else:
        return JsonResponse({}, safe=False)
    acc = Account.objects.filter(id=userid)[0]
    serialized = AccountSerializer(acc)
    print(serialized)
    return Response(serialized.data)


class LogoutView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        logout(request)

        return Response({}, status=status.HTTP_204_NO_CONTENT)


def Unsubscribe(request):
    if request.user.is_authenticated:
        userid = request.user.id
    else:
        return JsonResponse({}, safe=False)

    try:
        acc = Account.objects.filter(id=userid)[0]
        acc.email_notification = 0
        acc.save()
    except:
        print("failure unsubscribing")

    return JsonResponse({}, safe=False)


def CreateGamedata(request):
    if request.user.is_authenticated:
        userid = request.user.id
    else:
        return JsonResponse({}, safe=False)

    v = Version.objects.order_by('-id')[0]

    try:
        # if found return
        gameinfo = GameInfo.objects.filter(user_id=userid, version_id=v.id)[0]
        if gameinfo.user_id == int(userid):
            return JsonResponse({}, safe=False)

    except:
        gameinfo0 = GameInfo(user_id=userid, version_id=v.id, difficulty=0)
        gameinfo0.save()
        gameinfo1 = GameInfo(user_id=userid, version_id=v.id, difficulty=1)
        gameinfo1.save()
        gameinfo2 = GameInfo(user_id=userid, version_id=v.id, difficulty=2)
        gameinfo2.save()

    try:
        acc = Account.objects.filter(id=userid)[0]
        acc.versionlabel = v.label
        acc.save()
    except:
        JsonResponse({}, safe=False)

    return JsonResponse({}, safe=False)


def SendTrackingData(request):
    username = request.GET.get('username')
    if request.user.is_authenticated:
        username2 = request.user.username
        if username != username2:
            return JsonResponse({}, safe=False)
        username = username2

    lastpage = request.GET.get('lastpage')
    page = request.GET.get('page')
    timevisited = request.GET.get('time')

    ts = time.time()
    st = datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')
    data = '{"timestamp":"' + st + '", "lastpage":"' + lastpage + '", "page":"' + page + '", "time":"' + timevisited + '"}'

    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    folder_path = os.path.join(BASE_DIR, 'data')
    folder_path = os.path.join(folder_path, 'tracking')

    if not os.path.exists(folder_path):
        os.makedirs(folder_path)

    save_path = os.path.join(folder_path, username + '.json')

    try:
        if os.stat(save_path).st_size != 0:
            with open(save_path, 'a') as outfile:
                outfile.write(',\n' + data)
        else:
            with open(save_path, 'w+') as outfile:
                outfile.write(data)
    except:
        with open(save_path, 'w+') as outfile:
            outfile.write(data)

    return JsonResponse({}, safe=False)


def GetTrackingData(request):
    username = request.GET.get('username')

    if request.user.is_authenticated and request.user.username != 'admin':
        username = request.user.username
    # if username != 'admin':
    #     return JsonResponse({}, safe=False)

    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    folder_path = os.path.join(BASE_DIR, 'data')
    folder_path = os.path.join(folder_path, 'tracking')
    save_path = os.path.join(folder_path, username + '.json')

    with open(save_path) as outfile:
        data = outfile.read()
        arrData = json.loads('[' + data + ']')

    return JsonResponse(arrData, safe=False)


def GetAllTrackingData(request):
    if request.user.is_authenticated:
        username = request.user.username
    if username != 'admin':
        return JsonResponse({}, safe=False)

    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    folder_path = os.path.join(BASE_DIR, 'data')
    folder_path = os.path.join(folder_path, 'tracking')

    res = ''
    for filename in os.listdir(folder_path):
        with open(os.path.join(folder_path, filename)) as outfile:
            check = outfile.read() + ',\n'
            try:
                checkJson = json.loads('[' + check[:-2] + ']')
            except:
                print("failure")
                return JsonResponse('{"path":"' + folder_path + '\\' + filename + '"' + '"failure":"' + check + '"}',
                                    safe=False)
            res += check

    try:
        arrData = json.loads('[' + res[:-2] + ']')
        return JsonResponse(arrData, safe=False)
    except:
        print("failure")
        return JsonResponse('{"failure":"' + res[:-2] + '"}', safe=False)


def AntiCheat(status, difficulty, level, timeneeded, jumps, movement_inputs, enemies_killed, coins_collected, eastereggs_found,
              special_name):
    # Anticheat
    cheated = 'cheat_'


    if (difficulty == '0'):
        print("Todo")

    if (difficulty == '1'):
        # time
        if (status == 'completed'):
            if (int(level) == 1 and int(timeneeded) < 7500
                    or int(level) == 2 and int(timeneeded) < 4000
                    or int(level) == 3 and int(timeneeded) < 4000
                    or int(level) == 4 and int(timeneeded) < 4000):
                cheated += '_time'

        # jumps
        if (status == 'completed'):
            if (int(level) == 1 and int(jumps) < 8
                    or int(level) == 2 and int(jumps) < 4
                    or int(level) == 3 and int(jumps) < 4 #in 4 theoretisch möglich
                    or int(level) == 4 and int(jumps) < 3):
                cheated += '_jumps'

        # movement
        if (status == 'completed'):
            if (int(level) == 1 and int(movement_inputs) < 1
                    or int(level) == 2 and int(movement_inputs) < 1
                    or int(level) == 3 and int(movement_inputs) < 3
                    or int(level) == 4 and int(movement_inputs) < 1):
                cheated += '_movementInputs'

        # enemies killed
        if (int(level) == 1 and int(enemies_killed) > 6
                or int(level) == 2 and int(enemies_killed) > 10
                or int(level) == 3 and int(enemies_killed) > 21
                or int(level) == 4 and int(enemies_killed) > 1):
            cheated += '_enemiesKilled'

        # coins (+10 per coin easteregg)
        if (int(level) == 1 and int(coins_collected) > 80
                or int(level) == 2 and int(coins_collected) > 6
                or int(level) == 3 and int(coins_collected) > 7
                or int(level) == 4 and int(coins_collected) > 1):
            cheated += '_coinsCollected'

        # eastereggs
        if (int(level) == 1 and int(eastereggs_found) > 4
                or int(level) == 2 and int(eastereggs_found) > 2
                or int(level) == 3 and int(eastereggs_found) > 2
                or int(level) == 4 and int(eastereggs_found) > 1):
            cheated += '_eastereggsFound'

        # specialname
        if (int(level) == 1 and int(special_name) > 2
                or int(level) == 2 and int(special_name) > 1
                or int(level) == 3 and int(special_name) > 1
                or int(level) == 4 and int(special_name) > 1):
            cheated += '_specialName'

    if (difficulty == '2'):
        print("Todo")


    if cheated != 'cheat_':
        return cheated

    return status


def SendGameData(request):
    username = request.GET.get('username')
    if request.user.is_authenticated:
        username2 = request.user.username
        if username != username2:
            return JsonResponse('{"success":"' + username2 + '"}', safe=False)
        DBChange = True

    else:
        DBChange = False
    version = request.GET.get('version')

    try:
        v = Version.objects.order_by('-id')[0]
        correct_version = v.label  # get correct version
    except:
        correct_version = '0.10'  # get correct version
        print("no Version found")
        return JsonResponse('{"success":"' + version + '"}', safe=False)

    # check version
    if version != correct_version:
        return JsonResponse('{"success":"wrong_version"}', safe=False)

    levelcount = 5

    level = request.GET.get('level')
    status = request.GET.get('status')
    difficulty = request.GET.get('difficulty')
    timeneeded = request.GET.get('time')
    jumps = request.GET.get('jumps')
    movement_inputs = request.GET.get('movement_inputs')
    enemies_killed = request.GET.get('enemies_killed')
    coins_collected = request.GET.get('coins_collected')
    overall_coins = request.GET.get('overall_coins')
    eastereggs_found = request.GET.get('eastereggs_found')
    overall_eastereggs = request.GET.get('overall_eastereggs')
    special_name = request.GET.get('special_name')
    overall_special_name = request.GET.get('overall_special_name')
    character = request.GET.get('character')
    powerups = request.GET.get('powerups')
    overall_powerups = request.GET.get('overall_powerups')
    highscore = request.GET.get('highscore')



    if math.isnan(float(level)):
        level = '-1'
        print(level)

    print(highscore)
    try:
        if highscore == 'none':
            highscore = -1
        else:
            highscore = int(highscore)
    except:
        highscore = -1
        print('no highscore sent')

    newstatus = ''
    if status == 'completed':
        newstatus = 'c'

    elif status == 'restart':
        newstatus = 'r'

    elif status == 'back to start menu':
        newstatus = 'menu'

    else:
        newstatus = 'd'

    status = AntiCheat(status, difficulty, level, timeneeded, jumps, movement_inputs, enemies_killed, coins_collected,
                       eastereggs_found, special_name)

    ts = time.time()
    st = datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')
    data = '{"timestamp":"' + st + \
           '", "level":"' + level + \
           '", "difficulty":"' + difficulty + \
           '", "status":"' + status + \
           '", "time":"' + timeneeded + \
           '", "jumps":"' + jumps + \
           '", "movement_inputs":"' + movement_inputs + \
           '", "coins_collected":"' + coins_collected + \
           '", "enemies_killed":"' + enemies_killed + \
           '", "eastereggs_found":"' + eastereggs_found + \
           '", "special_name":"' + special_name + \
           '", "character":"' + character + \
           '", "powerups":"' + powerups + \
           '"}'

    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    folder_path = os.path.join(BASE_DIR, 'data')
    folder_path = os.path.join(folder_path, 'gamedata')
    folder_path = os.path.join(folder_path, version)

    if not os.path.exists(folder_path):
        os.makedirs(folder_path)

    save_path = os.path.join(folder_path, username + '.json')

    try:
        if os.stat(save_path).st_size != 0:
            with open(save_path, 'a') as outfile:
                outfile.write(',\n' + data)
        else:
            with open(save_path, 'w+') as outfile:
                outfile.write(data)
    except:
        with open(save_path, 'w+') as outfile:
            outfile.write(data)

    if DBChange:
        try:
            acc = GameInfo.objects.filter(user_id=request.user.id, version_id=v.id, difficulty=int(difficulty))[0]

        except:
            CreateGamedata(request)
            acc = GameInfo.objects.filter(user_id=request.user.id, version_id=v.id, difficulty=int(difficulty))[0]
            # return JsonResponse('{"success":"no gamedata"}', safe=False)

        acc.coins_collected = max(acc.coins_collected, int(overall_coins))
        acc.overall_coins += int(coins_collected)
        acc.enemies_killed += int(enemies_killed)
        acc.eastereggs_found = max(acc.eastereggs_found, int(overall_eastereggs))
        acc.overall_eastereggs += int(eastereggs_found)
        acc.special_name = max(acc.special_name, int(overall_special_name))
        acc.jumps += int(jumps)
        acc.movement_inputs += int(movement_inputs)

        acc.powerups = max(acc.powerups, int(overall_powerups))
        acc.overall_powerups += int(powerups)

        if level == 1 or level == '1':
            acc.rounds_started += 1

        #only count highest level when completed
        if newstatus == 'c':
            acc.highest_level = max(acc.highest_level, int(level))

        if newstatus == 'c' and level == levelcount:
            acc.rounds_won += 1
        if newstatus == 'r':
            acc.restarts += 1
        if newstatus == 'd':
            acc.deaths += 1

        acc.time_spent_game += int(timeneeded)


        #allow negative highscores
        if acc.highscore == -1:
            acc.highscore = highscore
        elif highscore != -1:
            acc.highscore = min(acc.highscore, highscore)

        acc.save()

    return JsonResponse('{"success":"true"}', safe=False)


def DidYouKnow(request):
    random = int(request.GET.get('random'))
    res = ''
    datetimefirst = datetime.datetime.strptime('2018-09-14', "%Y-%m-%d")
    datetimefirst = datetimefirst.replace(hour=19)
    datetimenow = datetime.datetime.now()
    datetimedif = datetimenow - datetimefirst

    #fuck the missing switch statement in python
    if random == 0:
        gi = GameInfo.objects.all().aggregate(Max('enemies_killed'))
        enemies_max = (int)(gi["enemies_killed__max"] / datetimedif.days)
        res = 'Every day around ' + str(enemies_max) + ' enemies are killed!'
    elif random == 1:
        gi = GameInfo.objects.all().aggregate(Max('overall_coins'))
        overall_coins = gi["overall_coins__max"]
        res = 'There were ' + str(overall_coins) + ' coins collected in total!'
    elif random == 2:
        gi = GameInfo.objects.all().aggregate(Max('overall_powerups'))
        overall_powerups = gi["overall_powerups__max"]
        res = 'A total of ' + str(overall_powerups) + ' powerups have been collected!'
    # elif random == 3:
    # elif random == 4:
    # elif random == 5:
    # elif random == 6:
    # elif random == 7:
    # elif random == 8:
    # elif random == 9:
    # elif random == 10:
    # elif random == 11:
    # elif random == 12:
    # elif random == 13:
    # elif random == 14:
    # elif random == 15:
    # elif random == 16:
    # elif random == 17:
    # elif random == 18:
    # elif random == 19:
    # elif random == 20:

    return JsonResponse('{"result":"' + res + '"}', safe=False)


def GetWinnerOfXDays(request):
    days = request.GET.get('days')

    v = Version.objects.order_by('-id')[0]
    acc = GameInfo.objects.filter(user_id=request.user.id, version_id=v.id)[0]
    winner = 'SSnake'
    wins = 5;
    return JsonResponse('{"winner":"' + winner + ' ,"wins":"' + wins + '"}', safe=False)


def ChangeCharacter(request):
    if request.user.is_authenticated:
        userid = request.user.id
    else:
        return JsonResponse('{"success":"' + 'user' + '"}', safe=False)

    character = request.GET.get('character')

    acc = Account.objects.filter(id=userid)[0]
    acc.character = character
    acc.save()

    return JsonResponse('{"success":"true"}', safe=False)


def ChangeDifficulty(request):
    if request.user.is_authenticated:
        userid = request.user.id
    else:
        return JsonResponse('{"success":"' + 'user' + '"}', safe=False)

    difficulty = request.GET.get('difficulty')

    acc = Account.objects.filter(id=userid)[0]
    acc.difficulty = difficulty
    acc.save()

    return JsonResponse('{"success":"true"}', safe=False)


@csrf_exempt
def UploadCharacter(request):
    if request.user.is_authenticated:
        userid = request.user.id
    else:
        return JsonResponse('{"success":"' + 'user' + '"}', safe=False)
    print(request.method)
    if request.method == 'POST' or request.method == 'GET':
        form = ImageUploadForm(request.POST, request.FILES)
        print(form)
        if form.is_valid():
            acc = Account.objects.filter(id=userid)[0]
            image = form.cleaned_data['image']
            size = len(image)
            if (size > 20 * 1024):
                return JsonResponse('{"Image to big! Max size is 20kb":"' + str(size) + '"}', safe=False)
            acc.uploaded_character = form.cleaned_data['image']
            acc.save()

            # change cookie
            print("test2")
            return HttpResponseRedirect('/game2')
        return HttpResponseRedirect('/game')
    else:
        return HttpResponseForbidden('allowed only via POST')


def GetGameData(request):
    username = request.GET.get('username')
    if request.user.is_authenticated and request.user.username != 'admin':
        username = request.user.username
    # if username != 'admin':
    #     return JsonResponse({}, safe=False)

    version = request.GET.get('version')

    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    folder_path = os.path.join(BASE_DIR, 'data')
    folder_path = os.path.join(folder_path, 'gamedata')
    folder_path = os.path.join(folder_path, version)
    save_path = os.path.join(folder_path, username + '.json')

    with open(save_path) as outfile:
        data = outfile.read()
        arrData = json.loads('[' + data + ']')

    return JsonResponse(arrData, safe=False)


def GetAllGameDataUser(request):
    username = request.GET.get('username')
    if request.user.is_authenticated and request.user.username != 'admin':
        username = request.user.username

    version = request.GET.get('version')
    res = ''

    if version == '0':
        try:
            BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            folder_path = os.path.join(BASE_DIR, 'data')
            folder_path = os.path.join(folder_path, 'gamedata')

            for versionfolder in os.listdir(folder_path):
                new_path = os.path.join(folder_path, versionfolder)
                for filename in os.listdir(new_path):
                    if filename == (username + '.json'):
                        with open(os.path.join(new_path, filename)) as outfile:
                            check = outfile.read() + ',\n'
                            if check == '':
                                continue
                            try:
                                checkJson = json.loads('[' + check[:-2] + ']')
                            except:
                                print("failure1")
                                return JsonResponse(
                                    '{"path":"' + new_path + '\\' + filename + '"' + ',"failure":"' + check + '"}',
                                    safe=False)
                            res += check
        except:
            return JsonResponse('{"failure":"' + new_path + '\\' + filename + '"}', safe=False)
    else:
        BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        folder_path = os.path.join(BASE_DIR, 'data')
        folder_path = os.path.join(folder_path, 'gamedata')
        folder_path = os.path.join(folder_path, version)

        for filename in os.listdir(folder_path):
            with open(os.path.join(folder_path, filename)) as outfile:
                check = outfile.read() + ',\n'
                if check == '':
                    continue
                try:
                    checkJson = json.loads('[' + check[:-2] + ']')
                except:
                    print("failure2")
                    return JsonResponse(
                        '{"path":"' + folder_path + '\\' + filename + '"' + ',"failure":"' + check + '"}', safe=False)
                res += check

    try:
        arrData = json.loads('[' + res[:-2] + ']')
    except:
        print("failure")
        return JsonResponse('{"failure":"' + res[:-2] + '"}', safe=False)
    return JsonResponse(arrData, safe=False)


def GetAllGameData(request):
    if request.user.is_authenticated:
        username = request.user.username
    if username != 'admin':
        return JsonResponse({}, safe=False)

    version = request.GET.get('version')
    res = ''

    if version == '0':
        try:
            BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            folder_path = os.path.join(BASE_DIR, 'data')
            folder_path = os.path.join(folder_path, 'gamedata')

            for versionfolder in os.listdir(folder_path):
                new_path = os.path.join(folder_path, versionfolder)
                for filename in os.listdir(new_path):
                    with open(os.path.join(new_path, filename)) as outfile:
                        check = outfile.read() + ',\n'
                        if check == '':
                            continue
                        try:
                            checkJson = json.loads('[' + check[:-2] + ']')
                        except:
                            print("failure1")
                            return JsonResponse(
                                '{"path":"' + new_path + '\\' + filename + '"' + ',"failure":"' + check + '"}',
                                safe=False)
                        res += check
        except:
            return JsonResponse('{"failure":"' + new_path + '\\' + filename + '"}', safe=False)
    else:
        BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        folder_path = os.path.join(BASE_DIR, 'data')
        folder_path = os.path.join(folder_path, 'gamedata')
        folder_path = os.path.join(folder_path, version)

        for filename in os.listdir(folder_path):
            with open(os.path.join(folder_path, filename)) as outfile:
                check = outfile.read() + ',\n'
                if check == '':
                    continue
                try:
                    checkJson = json.loads('[' + check[:-2] + ']')
                except:
                    print("failure2")
                    return JsonResponse(
                        '{"path":"' + folder_path + '\\' + filename + '"' + ',"failure":"' + check + '"}', safe=False)
                res += check

    try:
        arrData = json.loads('[' + res[:-2] + ']')
    except:
        print("failure")
        return JsonResponse('{"failure":"' + res[:-2] + '"}', safe=False)
    return JsonResponse(arrData, safe=False)


def GetAllUserGame(request):
    if request.user.is_authenticated:
        username = request.user.username
    if username != 'admin':
        return JsonResponse({}, safe=False)

    version = request.GET.get('version')

    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    folder_path = os.path.join(BASE_DIR, 'data')
    folder_path = os.path.join(folder_path, 'gamedata')
    folder_path = os.path.join(folder_path, version)

    listOfFiles = os.listdir(folder_path)
    resList = [os.path.splitext(x)[0] for x in listOfFiles]

    return JsonResponse(resList, safe=False)


def TransferData(request):
    identifier = request.GET.get('identifier')
    username = request.GET.get('username')
    if request.user.is_authenticated:
        username2 = request.user.username
        if username != username2:
            return JsonResponse({}, safe=False)
        username = username2
    destination = request.GET.get('destination')

    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    folder_path = os.path.join(BASE_DIR, 'data')
    folder_path = os.path.join(folder_path, destination)
    old_path = os.path.join(folder_path, identifier + '.json')
    new_path = os.path.join(folder_path, username + '.json')

    append_to_file(new_path, old_path)
    os.remove(old_path)

    return JsonResponse({}, safe=False)


def append_to_file(file, append):
    with open(file, 'a') as source:
        with open(append, 'r+') as appendix:
            source.write(',\n' + appendix.read())
