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

def updateConfigFile(dbServer):
	with open('./web_app/couchDBConfig.txt', 'w') as f:
		f.write(dbServer + ':5984\n')

def deployFrontend(keyfile, hostname, dbServer):
	updateConfigFile(dbServer)
	if sshFileCheck(keyfile):
		if find_executable('scp') is not None and os.path.isdir('web_app'):
			#Copy local.ini to home for couchDB setup
			status_code = subprocess.call(['scp', '-i', keyfile, '-r', './web_app/', 'ubuntu@' + hostname +':~/'])
			if status_code != 0:
				sys.exit(1)
		else:
			print('Please install scp or dataFrontend is in place and run the program again')
			sys.exit(1)
	else:
		print('public key is missing')
	if find_executable('ansible-playbook') is not None  and os.path.isfile('frontend.yml'):
		status_code = subprocess.call(['ansible-playbook', 'frontend.yml'])
		if status_code != 0:
			sys.exit(1)
		print('Ansible deploying Frontend done')
	else:
		print('ansible-playbook is not installed or frontend.yml might be missing')

	#with open('./web_app/couchDBConfig.txt', 'w') as f:
	#		f.write(hostname + '\n')

def main(argv):
	keyfile = ''
	hostname = ''
	dbServer = ''
	try:
		opts, args = getopt.getopt(argv,"hf:o:d:",["keyfile=","hostname=", "dbServer="])
	except getopt.GetoptError:
		print('deployFrontend.py -f <keyfile> -o <hostname> -d <dbServer>')
		sys.exit(2)
	for opt, arg in opts:
		if opt == '-h':
			print 'deployFrontend.py -f <keyfile> -o <hostname> -d <dbServer>'
			sys.exit()
		elif opt in ("-f", "--keyfile"):
			keyfile = arg
		elif opt in ("-o", "--hostname"):
			hostname = arg
		elif opt in ("-d", "--dbserver"):
			dbServer = arg

	deployFrontend(keyfile, hostname, dbServer)

		

if __name__ == "__main__":
   main(sys.argv[1:])