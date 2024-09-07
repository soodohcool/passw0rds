import random
import os

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
def leet(word, positions, max_leet_chars):
    word_array = list(word)
    leet_applied = False
    random.shuffle(positions)

    while not leet_applied and positions:
        for pos in positions[:max_leet_chars]:
            char = word_array[pos]
            if char in leet_map:
                word_array[pos] = leet_map[char]
                leet_applied = True
        if not leet_applied:
            random.shuffle(positions)

    return ''.join(word_array)

def mini_leet(word, positions, max_leet_chars):
    word_array = list(word)
    leet_applied = False
    random.shuffle(positions)

    while not leet_applied and positions:
        for pos in positions[:max_leet_chars]:
            char = word_array[pos]
            if char in mini_leet_map:
                word_array[pos] = mini_leet_map[char]
                leet_applied = True
        if not leet_applied:
            random.shuffle(positions)

    return ''.join(word_array)

def transform(word, transformation_type, positions, max_leet_chars):
    if transformation_type == 'leet':
        return leet(word, positions, max_leet_chars)
    elif transformation_type == 'miniLeet':
        return mini_leet(word, positions, max_leet_chars)
    else:
        return word

# Load words from a file
def load_word_list(filename):
    path = get_wordlist_path(filename)
    with open(path, 'r', encoding='utf-8') as f:
        return [word.strip() for word in f if config['min_length'] <= len(word.strip()) <= config['max_length']]

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
            words.append(word)
        else:
            words.append(char)

    plain_passphrase = separator.join(words)

    # Positions eligible for leet transformation
    leet_positions = [i for i, c in enumerate(plain_passphrase) if c in 'aeiost']
    transformed_passphrase = transform(plain_passphrase, config['transformation'], leet_positions, config['max_leet_chars'])
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
    config['max_leet_chars'] = random.randint(1, 5) if config['transformation'] != 'plain' else 0
    pattern_length = random.randint(2, 5)
    config['pattern'] = ''.join(random.choice(pattern_options) for _ in range(pattern_length))
    config['transformation'] = random.choice(transformation_options)

# Reset configuration to defaults
def reset_config():
    config.update({
        'num_passphrases': 3,
        'min_length': 4,
        'max_length': 8,
        'max_leet_chars': 2,
        'pattern': 'AVNP',
        'transformation': 'miniLeet'
    })

# Modify configuration interactively
def modify_config():
    print(f"\n{Colors.OKBLUE}Modify Configuration{Colors.ENDC}")
    for key in ['num_passphrases', 'min_length', 'max_length', 'max_leet_chars', 'pattern', 'transformation']:
        current_value = config[key]
        new_value = input(f"Enter value for {key} (current: {current_value}): ")
        if new_value.strip():
            if key in ['num_passphrases', 'min_length', 'max_length', 'max_leet_chars']:
                config[key] = int(new_value)
            else:
                config[key] = new_value
    print(f"{Colors.OKGREEN}Configuration updated successfully!{Colors.ENDC}")

# Display current configuration
def display_config():
    print(f"\n{Colors.OKCYAN}Current Configuration:{Colors.ENDC}")
    for key, value in config.items():
        print(f"{Colors.BOLD}{key}:{Colors.ENDC} {value}")

# Menu system
def menu():
    while True:
        print(f"\n{Colors.HEADER}--- Passw0rds by soodoh ---{Colors.ENDC}")
        print("1. Generate Passphrases")
        print("2. Randomize Configuration")
        print("3. Reset Configuration")
        print("4. Modify Configuration")
        print("5. Display Current Configuration")
        print(f"{Colors.FAIL}6. Exit{Colors.ENDC}")
        choice = input("Choose an option: ")

        if choice == '1':
            try:
                passphrases = generate_passphrases()
                print(f"\n{Colors.OKGREEN}Generated Passphrases:{Colors.ENDC}")
                for i, phrase in enumerate(passphrases, 1):
                    print(f"{Colors.OKBLUE}{i}:{Colors.ENDC} {phrase}")
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
            print(f"{Colors.OKCYAN}Goodbye!{Colors.ENDC}")
            break
        else:
            print(f"{Colors.WARNING}Invalid option. Please choose again.{Colors.ENDC}")

# Main entry point
if __name__ == '__main__':
    menu()
