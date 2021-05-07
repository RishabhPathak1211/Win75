import requests
import random

opturl = 'http://localhost:3000/user/sendOTP'
registerurl = 'http://localhost:3000/user/register'
loginurl = 'http://localhost:3000/user/login'
newprodurl = 'http://localhost:3000/product/new'

users = [
    {
        'username': 'user1',
        'password': 'user1',
        'phone': 'user1'
    },
    {
        'username': 'user2',
        'password': 'user2',
        'phone': 'user2'
    },
    {
        'username': 'user3',
        'password': 'user3',
        'phone': 'user3'
    },
    {
        'username': 'user4',
        'password': 'user4',
        'phone': 'user4'
    },
    {
        'username': 'user5',
        'password': 'user5',
        'phone': 'user5'
    }
]

imageurls = [
    'https://apollo-singapore.akamaized.net/v1/files/yzf5eghzn4f3-IN/image;s=272x0',
    'https://apollo-singapore.akamaized.net/v1/files/3j4k66pi92u03-IN/image;s=850x0',
    'https://apollo-singapore.akamaized.net/v1/files/d5kamaiitmnk3-IN/image;s=272x0',
    'https://apollo-singapore.akamaized.net/v1/files/gte7d8gdrmkm1-IN/image;s=272x0',
    'https://apollo-singapore.akamaized.net/v1/files/nmnk7tp2jy7p3-IN/image;s=272x0',
    'https://apollo-singapore.akamaized.net/v1/files/sicqpnftufr13-IN/image;s=272x0',
    'https://apollo-singapore.akamaized.net/v1/files/ky2e9n3h4nig2-IN/image;s=272x0',
    'https://apollo-singapore.akamaized.net/v1/files/sbum7j6suss93-IN/image;s=272x0',
    'https://apollo-singapore.akamaized.net/v1/files/nmnk7tp2jy7p3-IN/image;s=272x0'
]

categories = [
    'Books',
    'Electronics',
    'Artifacts',
    'Clothes'
]

user1prods = [
    {
        'title': 'prod11',
        'description': 'this is prod11',
        'imageUrl': random.choice(imageurls),
        'category': random.choice(categories)
    },
    {
        'title': 'prod12',
        'description': 'this is prod12',
        'imageUrl': random.choice(imageurls),
        'category': random.choice(categories)
    },
    {
        'title': 'prod13',
        'description': 'this is prod13',
        'imageUrl': random.choice(imageurls),
        'category': random.choice(categories)
    },
    {
        'title': 'prod14',
        'description': 'this is prod14',
        'imageUrl': random.choice(imageurls),
        'category': random.choice(categories)
    },
    {
        'title': 'prod15',
        'description': 'this is prod15',
        'imageUrl': random.choice(imageurls),
        'category': random.choice(categories)
    },
    {
        'title': 'prod16',
        'description': 'this is prod16',
        'imageUrl': random.choice(imageurls),
        'category': random.choice(categories)
    }
]

user2prods = [
    {
        'title': 'prod21',
        'description': 'this is prod21',
        'imageUrl': random.choice(imageurls),
        'category': random.choice(categories)
    },
    {
        'title': 'prod22',
        'description': 'this is prod12',
        'imageUrl': random.choice(imageurls),
        'category': random.choice(categories)
    },
    {
        'title': 'prod23',
        'description': 'this is prod13',
        'imageUrl': random.choice(imageurls),
        'category': random.choice(categories)
    },
    {
        'title': 'prod24',
        'description': 'this is prod24',
        'imageUrl': random.choice(imageurls),
        'category': random.choice(categories)
    },
    {
        'title': 'prod25',
        'description': 'this is prod25',
        'imageUrl': random.choice(imageurls),
        'category': random.choice(categories)
    },
    {
        'title': 'prod26',
        'description': 'this is prod26',
        'imageUrl': random.choice(imageurls),
        'category': random.choice(categories)
    },
    {
        'title': 'prod27',
        'description': 'this is prod27',
        'imageUrl': random.choice(imageurls),
        'category': random.choice(categories)
    }
]

user3prods = [
    {
        'title': 'prod31',
        'description': 'this is prod31',
        'imageUrl': random.choice(imageurls),
        'category': random.choice(categories)
    },
    {
        'title': 'prod32',
        'description': 'this is prod32',
        'imageUrl': random.choice(imageurls),
        'category': random.choice(categories)
    },
    {
        'title': 'prod33',
        'description': 'this is prod33',
        'imageUrl': random.choice(imageurls),
        'category': random.choice(categories)
    },
    {
        'title': 'prod34',
        'description': 'this is prod34',
        'imageUrl': random.choice(imageurls),
        'category': random.choice(categories)
    }
]

user4prods = [
    {
        'title': 'prod41',
        'description': 'this is prod41',
        'imageUrl': random.choice(imageurls),
        'category': random.choice(categories)
    },
    {
        'title': 'prod42',
        'description': 'this is prod42',
        'imageUrl': random.choice(imageurls),
        'category': random.choice(categories)
    }
]

user5prods = [
    {
        'title': 'prod51',
        'description': 'this is prod51',
        'imageUrl': random.choice(imageurls),
        'category': random.choice(categories)
    },
    {
        'title': 'prod52',
        'description': 'this is prod52',
        'imageUrl': random.choice(imageurls),
        'category': random.choice(categories)
    },
    {
        'title': 'prod53',
        'description': 'this is prod53',
        'imageUrl': random.choice(imageurls),
        'category': random.choice(categories)
    },
    {
        'title': 'prod54',
        'description': 'this is prod54',
        'imageUrl': random.choice(imageurls),
        'category': random.choice(categories)
    },
    {
        'title': 'prod55',
        'description': 'this is prod55',
        'imageUrl': random.choice(imageurls),
        'category': random.choice(categories)
    }
]

s = requests.Session()

# for user in users:
#     otp = s.post(opturl, data=user).json()['otp']
#     response = s.post(registerurl, data={ 'otp': otp })
#     print(response.json())

s.post(loginurl, data=users[4])
for prod in user5prods:
    s.post(newprodurl, data=prod)