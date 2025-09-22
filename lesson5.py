flags = {
    'ru': {'red', 'blue', 'white'},
    'kg': {'red', 'yellow', 'red'}, 
    'ua': {'blue', 'yellow'},
    'uk': {'blue', 'red'},
    'kz': {'blue', 'yellow', 'blue'},
    'ch': {'red', 'yellow'},
    'cn': {'red', 'white'},
    'eg': {'black', 'white', 'red'},   
    }

while True:
    user_input = input("Ведите цвет:").lower().strip()

    if user_input == ("выход"):
        break
    colors = set(user_input.split())
    result = [domain for domain, flag_colors in flags.items() if colors.issubset(flag_colors)]
     
    if result:
        print("имеется:", ", ".join(result))

    else:
        print("не имеется")