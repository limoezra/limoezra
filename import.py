import  random
x = random.randint(1, 109)
y = random.random()
print(x)
myList = ['rock' ,'paper' ,'scissors']
z = random.choice(myList)

print(y) 
cards = [1,2,3,4,5,6,7,8,9,"J","Q","K","A"]
random.shuffle(cards)
print(cards)