from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
import csv


s =  Service("/usr/local/bin/chromedriver")

chromeOptions = Options()
# chromeOptions.add_argument("--headless=new")
chromeOptions.headless = False
chromeOptions.add_argument("load-extension=./predict_extension_bert_auto")
chromeOptions.add_experimental_option("detach", True)

files = ['correio.txt']

urls = {}
for i in files:
    file = open("urls/"+i, "r")
    data=[]
    for line in file:
        line = line.split('\n')[0].replace(" ", "")
        data.append(line)
    split = i.split('.')
    urls[split[0]] = data
    print(urls)
    file.close()


driver = webdriver.Chrome(service=s, options=chromeOptions)

def get_logs(url):
    driver.get(url)
    print("starting Driver")

    button = driver.find_element(By.XPATH, "/html/body/button")
    driver.execute_script("arguments[0].click();", button)
    
    timeout = 1
    entities = {'ORGANIZACAO': 0, 'PESSOA': 0, 'TEMPO': 0, 'LOCAL': 0, 'LEGISLACAO': 0, 'JURISPRUDENCIA': 0}

    while (timeout <= 100):
        try:
            WebDriverWait(driver, timeout=timeout).until(EC.presence_of_element_located((By.CLASS_NAME, 'log')))
            break
        except TimeoutException:
            timeout += 2

    if(timeout > 100):
        return "Tempo excedeu 100s !" 

    logs = driver.find_elements(By.CLASS_NAME, "log")

    log_texts = []

    for log in logs:
        log_texts.append(log.text)


    b_org = driver.find_elements(By.CLASS_NAME, "B-ORGANIZACAO")
    b_temp = driver.find_elements(By.CLASS_NAME, "B-TEMPO")
    b_per = driver.find_elements(By.CLASS_NAME, "B-PESSOA")
    b_loc = driver.find_elements(By.CLASS_NAME, "B-LOCAL")
    b_leg = driver.find_elements(By.CLASS_NAME, "B-LEGISLACAO")
    b_jur = driver.find_elements(By.CLASS_NAME, "B-JURISPRUDENCIA")

    entities["ORGANIZACAO"] += len(b_org) 
    entities["PESSOA"] += len(b_per)  
    entities["TEMPO"] += len(b_temp) 
    entities["LOCAL"] += len(b_loc) 
    entities["LEGISLACAO"] += len(b_leg) 
    entities["JURISPRUDENCIA"] += len(b_jur)
    return (log_texts, entities)


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
