from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException

# Path to the ChromeDriver executable (modify if needed)
s =  Service("/usr/local/bin/chromedriver")

chromeOptions = Options()

# Uncomment this line to run in headless mode (Chrome browser invisible)
# chromeOptions.add_argument("--headless=new")

# Load a Chrome extension (modify the path as needed)
chromeOptions.add_argument("load-extension=./predict_extension_bert_auto")
# Option to keep the browser window open after script execution
chromeOptions.add_experimental_option("detach", True)

# List of text files containing URLs (modify the file path as needed)
files = ['correio.txt', 'congresso.txt', 'g1.txt', 'jota.txt', 'migalhas.txt']

# Dictionary to store URLs from each file
urls = {}

for i in files:
    # Open the text file containing URLs
    file = open("urls/"+i, "r")
    data=[]
    for line in file:
        # Clean up each line by removing trailing newline and whitespaces
        line = line.split('\n')[0].replace(" ", "")
        data.append(line)
    # Split the filename to get a site name
    split = i.split('.')
    urls[split[0]] = data
    file.close()


driver = webdriver.Chrome(service=s, options=chromeOptions)

def get_logs(url):
    driver.get(url)
    print("starting Driver")

    # Find the button element to activate the extension using XPath (modify if needed)
    button = driver.find_element(By.XPATH, "/html/body/button")
    driver.execute_script("arguments[0].click();", button)
    
     # Set a timeout for waiting for elements to appear
    timeout = 1
    entities = {'ORGANIZACAO': 0, 'PESSOA': 0, 'TEMPO': 0, 'LOCAL': 0, 'LEGISLACAO': 0, 'JURISPRUDENCIA': 0}

    while (timeout <= 100):
        try:
            # Wait for the element with class 'log' to appear
            WebDriverWait(driver, timeout=timeout).until(EC.presence_of_element_located((By.CLASS_NAME, 'log')))
            break
        except TimeoutException:
            # Increase timeout if element not found
            timeout += 2

    if(timeout > 100):
        # Timeout message (modify if needed)
        return "Tempo excedeu 100s !" 

    # Find all elements with class 'log'
    logs = driver.find_elements(By.CLASS_NAME, "log")

    log_texts = []

    for log in logs:
        # Extract text from each log element
        log_texts.append(log.text)

    # Find elements with class names for different entity types
    b_org = driver.find_elements(By.CLASS_NAME, "B-ORGANIZACAO")
    b_temp = driver.find_elements(By.CLASS_NAME, "B-TEMPO")
    b_per = driver.find_elements(By.CLASS_NAME, "B-PESSOA")
    b_loc = driver.find_elements(By.CLASS_NAME, "B-LOCAL")
    b_leg = driver.find_elements(By.CLASS_NAME, "B-LEGISLACAO")
    b_jur = driver.find_elements(By.CLASS_NAME, "B-JURISPRUDENCIA")

    # Count the number of entities of each type
    entities["ORGANIZACAO"] += len(b_org) 
    entities["PESSOA"] += len(b_per)  
    entities["TEMPO"] += len(b_temp) 
    entities["LOCAL"] += len(b_loc) 
    entities["LEGISLACAO"] += len(b_leg) 
    entities["JURISPRUDENCIA"] += len(b_jur)

    # Return extracted log text and entity counts
    return (log_texts, entities)


# Write logs in the timeLogs.txt file
for i in urls:
    for url in urls[i]:                                                                                    

        logs, entities = get_logs(url)
        print(logs)                 
        
        f = open("timeLogs.txt", "a")
        f.write(i + "; ")

        for log in logs:
            f.write(log+'; ')

        for j in entities:
            f.write(j+': ')
            f.write(str(entities[j])+'; ')

        f.write(url + ";")
        f.write("\n")
        f.close()
