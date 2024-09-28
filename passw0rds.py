import random
import os
import time
import sys

# ANSI escape sequences for colors
class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

# Configuration (modifiable by user)
config = {
    'num_passphrases': 3,
    'adjectives_file': 'adjectives.txt',
    'nouns_file': 'nouns.txt',
    'verbs_file': 'verbs.txt',
    'plurals_file': 'plural_nouns.txt',
    'min_length': 4,
    'max_length': 8,
    'min_leet_chars': 1,
    'max_leet_chars': 2,
    'pattern': 'AVNP',
    'transformation': 'miniLeet'
}

# Get file paths
def get_wordlist_path(filename):
    return os.path.join(os.path.dirname(__file__), filename)

# Leet transformation maps
leet_map = {'a': '4', 'e': '3', 'i': '1', 'o': '0', 's': '$', 't': '7'}
mini_leet_map = {'a': '4', 'e': '3', 'i': '1', 'o': '0'}

# Transformation functions
def leet(word, positions, min_leet_chars, max_leet_chars):
    word_array = list(word)
    leet_applied = 0
    random.shuffle(positions)

    for pos in positions:
        if leet_applied >= max_leet_chars:
            break
        char = word_array[pos].lower()
        if char in leet_map:
            word_array[pos] = leet_map[char]
            leet_applied += 1

    # Ensure minimum leet characters are applied
    while leet_applied < min_leet_chars:
        for pos in positions:
            char = word_array[pos].lower()
            if char in leet_map and word_array[pos] != leet_map[char]:
                word_array[pos] = leet_map[char]
                leet_applied += 1
                break

    return ''.join(word_array)

def mini_leet(word, positions, min_leet_chars, max_leet_chars):
    word_array = list(word)
    leet_applied = 0
    random.shuffle(positions)

    for pos in positions:
        if leet_applied >= max_leet_chars:
            break
        char = word_array[pos].lower()
        if char in mini_leet_map:
            word_array[pos] = mini_leet_map[char]
            leet_applied += 1

    # Ensure minimum leet characters are applied
    while leet_applied < min_leet_chars:
        for pos in positions:
            char = word_array[pos].lower()
            if char in mini_leet_map and word_array[pos] != mini_leet_map[char]:
                word_array[pos] = mini_leet_map[char]
                leet_applied += 1
                break

    return ''.join(word_array)

def transform(word, transformation_type, positions, min_leet_chars, max_leet_chars):
    if transformation_type == 'leet':
        return leet(word, positions, min_leet_chars, max_leet_chars)
    elif transformation_type == 'miniLeet':
        return mini_leet(word, positions, min_leet_chars, max_leet_chars)
    else:
        return word

# Load words from a file
def load_word_list(filename):
    path = get_wordlist_path(filename)
    with open(path, 'r', encoding='utf-8') as f:
        return [word.strip() for word in f if config['min_length'] <= len(word.strip()) <= config['max_length']]

# Randomly capitalize the first letter of a word
def randomly_capitalize(word):
    return word.capitalize() if random.random() < 0.5 else word

# Generate a passphrase
def generate_passphrase(adjectives, nouns, verbs, plurals):
    word_map = {
        'A': adjectives.copy(),
        'V': verbs.copy(),
        'N': nouns.copy(),
        'P': plurals.copy()
    }
    separator = random.choice(['~', '-', '_', '.'])
    pattern_chars = list(config['pattern'])
    words = []

    for char in pattern_chars:
        if word_map[char]:
            word = random.choice(word_map[char])
            word_map[char].remove(word)  # Ensure uniqueness
            words.append(randomly_capitalize(word))
        else:
            words.append(char)

    plain_passphrase = separator.join(words)

    # Positions eligible for leet transformation
    leet_positions = [i for i, c in enumerate(plain_passphrase.lower()) if c in 'aeiost']
    transformed_passphrase = transform(plain_passphrase, config['transformation'], leet_positions, config['min_leet_chars'], config['max_leet_chars'])
    return transformed_passphrase

# Generate multiple passphrases
def generate_passphrases():
    adjectives = load_word_list(config['adjectives_file'])
    nouns = load_word_list(config['nouns_file'])
    verbs = load_word_list(config['verbs_file'])
    plurals = load_word_list(config['plurals_file'])

    passphrases = []
    for _ in range(config['num_passphrases']):
        passphrase = generate_passphrase(adjectives, nouns, verbs, plurals)
        passphrases.append(passphrase)
    return passphrases

# Randomize configuration
def randomize_config():
    transformation_options = ['leet', 'miniLeet', 'plain']
    pattern_options = ['A', 'V', 'N', 'P']

    config['num_passphrases'] = random.randint(1, 10)
    config['min_length'] = 4
    config['max_length'] = 99
    config['min_leet_chars'] = random.randint(0, 5)
    config['max_leet_chars'] = random.randint(config['min_leet_chars'], 10)
    pattern_length = random.randint(2, 5)
    config['pattern'] = ''.join(random.choice(pattern_options) for _ in range(pattern_length))
    config['transformation'] = random.choice(transformation_options)

# Reset configuration to defaults
def reset_config():
    config.update({
        'num_passphrases': 3,
        'min_length': 4,
        'max_length': 8,
        'min_leet_chars': 1,
        'max_leet_chars': 2,
        'pattern': 'AVNP',
        'transformation': 'miniLeet'
    })

# Modify configuration interactively
def modify_config():
    print(f"\n{Colors.OKBLUE}Modify Configuration{Colors.ENDC}")
    for key in ['num_passphrases', 'min_length', 'max_length', 'min_leet_chars', 'max_leet_chars', 'pattern', 'transformation']:
        current_value = config[key]
        new_value = input(f"Enter value for {key} (current: {current_value}): ")
        if new_value.strip():
            if key in ['num_passphrases', 'min_length', 'max_length', 'min_leet_chars', 'max_leet_chars']:
                config[key] = int(new_value)
            else:
                config[key] = new_value
    print(f"{Colors.OKGREEN}Configuration updated successfully!{Colors.ENDC}")

# Display current configuration
def display_config():
    print(f"\n{Colors.OKCYAN}╔{'═' * 50}╗")
    print(f"║{Colors.BOLD} Current Configuration{' ' * 30}{Colors.ENDC}{Colors.OKCYAN}║")
    print(f"╠{'═' * 50}╣")
    for key, value in config.items():
        print(f"║ {Colors.BOLD}{key}:{Colors.ENDC}{' ' * (20 - len(key))}{value}{' ' * (20 - len(str(value)))}║")
    print(f"╚{'═' * 50}╝{Colors.ENDC}")

# Display help text
def display_help():
    help_text = f"""
{Colors.HEADER}╔{'═' * 60}╗
║{' ' * 27}Help{' ' * 29}║
╠{'═' * 60}╣{Colors.ENDC}
║ {Colors.BOLD}Number of Passphrases:{Colors.ENDC} Total passphrases to generate   ║
║ {Colors.BOLD}Leet Characters:{Colors.ENDC}                                    ║
║   - Min: Minimum characters to transform                ║
║   - Max: Maximum characters to transform                ║
║ {Colors.BOLD}Min Word Length:{Colors.ENDC} Minimum length for each word         ║
║ {Colors.BOLD}Max Word Length:{Colors.ENDC} Maximum length for each word         ║
║ {Colors.BOLD}Pattern:{Colors.ENDC} Sequence of word types (A, V, N, P)          ║
║   A: Adjective, V: Verb, N: Noun, P: Plural Noun        ║
║ {Colors.BOLD}Transform:{Colors.ENDC} Transformation method                      ║
║   - Leet: Full leet speak                               ║
║   - Mini Leet: Simplified leet speak                    ║
║   - Plain: No transformation                            ║
{Colors.HEADER}╚{'═' * 60}╝{Colors.ENDC}
"""
    print(help_text)

def animate_title():
    title = [
        "██████╗  █████╗ ███████╗███████╗██╗    ██╗ ██████╗ ██████╗ ██████╗ ███████╗",
        "██╔══██╗██╔══██╗██╔════╝██╔════╝██║    ██║██╔═████╗██╔══██╗██╔══██╗██╔════╝",
        "██████╔╝███████║███████╗███████╗██║ █╗ ██║██║██╔██║██████╔╝██║  ██║███████╗",
        "██╔═══╝ ██╔══██║╚════██║╚════██║██║███╗██║████╔╝██║██╔══██╗██║  ██║╚════██║",
        "██║     ██║  ██║███████║███████║╚███╔███╔╝╚██████╔╝██║  ██║██████╔╝███████║",
        "╚═╝     ╚═╝  ╚═╝╚══════╝╚══════╝ ╚══╝╚══╝  ╚═════╝ ╚═╝  ╚═╝╚═════╝ ╚══════╝",
        "▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ by Kenny Scott ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒",

    ]
    
    colors = [Colors.OKBLUE, Colors.OKBLUE, Colors.OKCYAN, Colors.OKCYAN, Colors.OKGREEN, Colors.OKGREEN, Colors.WARNING]
    
    os.system('cls' if os.name == 'nt' else 'clear')  # Clear the screen
    
    for line, color in zip(title, colors):
        for char in line:
            sys.stdout.write(f"{color}{char}{Colors.ENDC}")
            sys.stdout.flush()
            time.sleep(0.001)  # Adjust this value to change the typing speed
        sys.stdout.write('\n')
    
    time.sleep(0.5)  # Pause after the animation

# Menu system
def menu():
    while True:
        animate_title()
        print("")
        print(f"{' ' * 11}{Colors.OKBLUE}╔{'═' * 50}╗")
        print(f"{' ' * 11}║{Colors.BOLD}{Colors.OKCYAN}{' ' * 22}Menu{' ' * 24}{Colors.ENDC}{Colors.OKBLUE}║")
        print(f"{' ' * 11}╠{'═' * 50}╣")
        print(f"{' ' * 11}║  {Colors.WARNING}1.{Colors.ENDC} {Colors.OKGREEN}Generate Passphrases{Colors.ENDC}{Colors.OKBLUE}{' ' * 25}║")
        print(f"{' ' * 11}║  {Colors.WARNING}2.{Colors.ENDC} {Colors.OKGREEN}Randomize Configuration{Colors.ENDC}{Colors.OKBLUE}{' ' * 22}║")
        print(f"{' ' * 11}║  {Colors.WARNING}3.{Colors.ENDC} {Colors.OKGREEN}Reset Configuration{Colors.ENDC}{Colors.OKBLUE}{' ' * 26}║")
        print(f"{' ' * 11}║  {Colors.WARNING}4.{Colors.ENDC} {Colors.OKGREEN}Modify Configuration{Colors.ENDC}{Colors.OKBLUE}{' ' * 25}║")
        print(f"{' ' * 11}║  {Colors.WARNING}5.{Colors.ENDC} {Colors.OKGREEN}Display Current Configuration{Colors.ENDC}{Colors.OKBLUE}{' ' * 16}║")
        print(f"{' ' * 11}║  {Colors.WARNING}6.{Colors.ENDC} {Colors.OKGREEN}Help{Colors.ENDC}{Colors.OKBLUE}{' ' * 41}║")
        print(f"{' ' * 11}║  {Colors.WARNING}7.{Colors.ENDC} {Colors.OKGREEN}Exit{Colors.ENDC}{Colors.OKBLUE}{' ' * 41}║")
        print(f"{' ' * 11}╚{'═' * 50}╝{Colors.ENDC}")
        
        choice = input(f"\n{Colors.OKCYAN}Choose an option (1-7): {Colors.ENDC}")

        if choice == '1':
            try:
                passphrases = generate_passphrases()
                print(f"\n{Colors.OKBLUE}╔{'═' * 50}╗")
                print(f"║{Colors.BOLD}{Colors.OKGREEN} Generated Passphrases:{Colors.ENDC}{Colors.OKBLUE}{' ' * 26}║")
                print(f"╠{'═' * 50}╣")
                for i, phrase in enumerate(passphrases, 1):
                    print(f"║ {Colors.WARNING}{i}.{Colors.ENDC} {phrase}{' ' * (47 - len(phrase) - len(str(i)))}║")
                print(f"╚{'═' * 50}╝{Colors.ENDC}")
            except Exception as e:
                print(f"{Colors.FAIL}Error: {e}{Colors.ENDC}")
        elif choice == '2':
            randomize_config()
            print(f"{Colors.OKGREEN}Configuration randomized.{Colors.ENDC}")
        elif choice == '3':
            reset_config()
            print(f"{Colors.OKGREEN}Configuration reset to defaults.{Colors.ENDC}")
        elif choice == '4':
            modify_config()
        elif choice == '5':
            display_config()
        elif choice == '6':
            display_help()
        elif choice == '7':
            print(f"{Colors.OKCYAN}Thank you for using passw0rds. Goodbye!{Colors.ENDC}")
            break
        else:
            print(f"{Colors.FAIL}Invalid option. Please choose a number between 1 and 7.{Colors.ENDC}")
        
        input(f"\n{Colors.OKBLUE}Press Enter to continue...{Colors.ENDC}")
        os.system('cls' if os.name == 'nt' else 'clear')  # Clear the screen

# Main entry point
if __name__ == '__main__':
    menu()
