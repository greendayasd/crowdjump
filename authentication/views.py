import json, os, time, datetime
from django.contrib.auth import authenticate, login, logout
from authentication.models import Account
from authentication.permissions import IsAccountOwner
from authentication.serializers import AccountSerializer
from rest_framework.response import Response
from rest_framework import status, permissions, viewsets, views
from django.http import JsonResponse
import http.cookiejar, urllib.request, requests


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
        serializer = AccountSerializer(users, many=True, context={'request': request})
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


class LogoutView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        logout(request)

        return Response({}, status=status.HTTP_204_NO_CONTENT)


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

    if request.user.is_authenticated:
        username = request.user.username
    if username != 'admin':
        return JsonResponse({}, safe=False)

    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    folder_path = os.path.join(BASE_DIR, 'data')
    folder_path = os.path.join(folder_path, 'tracking')
    save_path = os.path.join(folder_path, username + '.json')

    with open(save_path) as outfile:
        data = outfile.read()
        arrData = json.loads('[' + data + ']')

    return JsonResponse(arrData, safe=False)


def SendGameData(request):
    username = request.GET.get('username')
    if request.user.is_authenticated:
        username2 = request.user.username
        if username != username2:
            return JsonResponse('{"success":"' + username2 + '"}', safe=False)
        username = username2

    version = request.GET.get('version')
    level = request.GET.get('level')
    status = request.GET.get('status')
    timeneeded = request.GET.get('time')

    #Anticheat
    # if (status == 'completed'):
    #     if (int(timeneeded) < 4000 and int(level) == 0
    #             or int(timeneeded) < 8500 and int(level) == 1
    #             or int(timeneeded) < 16000 and int(level) == 2
    #             or int(timeneeded) < 21000 and int(level) == 3):
    #         # cheated
    #         return JsonResponse('{"sucess":"true"}', safe=False)

    jumps = request.GET.get('jumps')
    movement_inputs = request.GET.get('movement_inputs')
    enemies_killed = request.GET.get('enemies_killed')
    coins_collected = request.GET.get('coins_collected')

    ts = time.time()
    st = datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')
    data = '{"timestamp":"' + st + '", "level":"' + level + '", "status":"' + status + '", "time":"' + timeneeded + \
           '", "jumps":"' + jumps + '", "movement_inputs":"' + movement_inputs + '"}'

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

    return JsonResponse('{"success":"true"}', safe=False)


def GetGameData(request):
    username = request.GET.get('username')
    if request.user.is_authenticated:
        username = request.user.username
    if username != 'admin':
        return JsonResponse({}, safe=False)

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


def GetAllGameData(request):
    if request.user.is_authenticated:
        username = request.user.username
    if username != 'admin':
        return JsonResponse({}, safe=False)

    version = request.GET.get('version')

    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    folder_path = os.path.join(BASE_DIR, 'data')
    folder_path = os.path.join(folder_path, 'gamedata')
    folder_path = os.path.join(folder_path, version)


    res = ''
    for filename in os.listdir(folder_path):
        with open(os.path.join(folder_path, filename)) as outfile:
            res += outfile.read() + ','


    arrData = json.loads('[' + res[:-1] + ']')
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
