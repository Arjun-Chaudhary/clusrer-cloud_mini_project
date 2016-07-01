#CCC2016-1, Melbourne, ARJUN CHAUDHARY, 727553
#CCC2016-1, Melbourne, HARSHIT KAPOOR, 666810
#CCC2016-1, Melbourne, LUPIYA MUJALA, 610273
#CCC2016-1, Melbourne, Templeton Tsai, 723957
#CCC2016-1, Melbourne, MUHAMMAD UMER ALTAF, 778566
import subprocess
import os.path
from distutils.spawn import find_executable
import sys
import getopt

def sshFileCheck(keyfile):
	return os.path.isfile(keyfile)

def deployView(hostname):
    print('deploy views')

    status_code = subprocess.call(['curl', '-X', 'PUT', 'http://umer:umer@' +hostname + ':5984/family_data/_design/view', '-d', '@view.json'])
            
    if status_code != 0:
        sys.exit(1)

    status_code = subprocess.call(['curl', '-X', 'PUT', 'http://umer:umer@' +hostname + ':5984/block_income/_design/incomeView', '-d', '@incomeView.json'])
            
    if status_code != 0:
        sys.exit(1)

    status_code = subprocess.call(['curl', '-X', 'PUT', 'http://umer:umer@' +hostname + ':5984/tweets/_design/hasCoordinate', '-d', '@hasCoordinate.json'])
            
    if status_code != 0:
        sys.exit(1)

    print('deployView Done')

def updateConfigFile(dbServer):
	with open('./dataProcessor/conf/conf.cfg', 'r') as f:
		data = f.readlines()

	data[5] = 'COUCH_SERVER = http://' + dbServer + ':5984/\n'
	with open('./dataProcessor/conf/conf.cfg', 'w') as f:
		f.writelines(data)


def deployDataprocessor(keyfile, hostname, dbServer):

	updateConfigFile(dbServer)
	
	if sshFileCheck(keyfile):
		if find_executable('scp') is not None and os.path.isdir('dataProcessor'):

			#Copy dataProcessor to home for couchDB setup
			status_code = subprocess.call(['scp', '-i', keyfile, '-r', './dataProcessor/', 'ubuntu@' + hostname +':~/dataProcessor'])
			if status_code != 0:
				sys.exit(1)

			status_code = subprocess.call(['scp', '-i', keyfile, '-r', './nltk_data', 'ubuntu@' + hostname +':~/'])
			if status_code != 0:
				sys.exit(1)
		else:
			print('Please install scp or dataProcessor or nltk_data is in place and run the program again')
			sys.exit(1)
	else:
		print('public key is missing')
	
	deployView(hostname)
	
	if find_executable('ansible-playbook') is not None  and os.path.isfile('dataProcessor.yml'):
		status_code = subprocess.call(['ansible-playbook', 'dataProcessor.yml'])
		if status_code != 0:
			sys.exit(1)
		print('Ansible deploying dataProcessor done')
	else:
		print('ansible-playbook is not installed or dataProcessor.yml might be missing')

def main(argv):
	keyfile = ''
	hostname = ''
	dbServer = ''
	try:
		opts, args = getopt.getopt(argv,"hf:o:d:",["keyfile=","hostname=", "dbServer="])
	except getopt.GetoptError:
		print('deployDataProcessor.py -f <keyfile> -o <hostname> -d <dbServer>')
		sys.exit(2)
	for opt, arg in opts:
		if opt == '-h':
			print 'deployDataProcessor.py -f <keyfile> -o <hostname> -d <dbServer>'
			sys.exit()
		elif opt in ("-f", "--keyfile"):
			keyfile = arg
		elif opt in ("-o", "--hostname"):
			hostname = arg
		elif opt in ("-d", "--dbserver"):
			dbServer = arg

	deployDataprocessor(keyfile, hostname, dbServer)

		

if __name__ == "__main__":
   main(sys.argv[1:])