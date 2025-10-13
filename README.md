class BankAccount:
    def __init__(self, name, balance):
        self.name = name
        self.__balance = balance #Приватность данных
    
    def deposit(self, amount):
         if amount > 0:
            self.__balance += amount
        
    def withdraw(self, amount):
         if 12 < amount <= self.__balance:
            self.__balance -= amount
    
    def get_balance(self):
         return self.__balance
    
class Product:
    def set_discount(percent):
        self.__price = price


acc = BankAccount('Ислам', 1000)
print(acc.name)
print(acc.deposit(500))
print(acc.get_balance)

