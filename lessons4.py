data_tuple = ("a", "L" , "E" , "h" , True , 2.34 ,1 ,3)
Letters = []
Numbers = []  

for i in data_tuple:
    if type(i) == str:
        Letters.append(i)
    else: 
        Numbers.append(i) 

Letters.append(Numbers.pop (0))

Numbers.remove(2.34)
Numbers.insert(1, 2) 
Numbers.sort()
Letters[0] = 5 
Letters.append("hela") 

Letters = tuple(Letters)
Numbers = tuple(Numbers)
print(Letters)
print(Numbers)