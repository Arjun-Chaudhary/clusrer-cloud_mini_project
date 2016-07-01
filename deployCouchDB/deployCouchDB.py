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


def deployCouchDB(keyfile, hostname):
	if sshFileCheck(keyfile):
		if find_executable('scp') is not None and os.path.isfile('local.ini'):
			#Copy local.ini to home for couchDB setup
			status_code = subprocess.call(['scp', '-i', keyfile, '-o', 'StrictHostKeyChecking=no','./local.ini', 'ubuntu@' + hostname + ':~/'])
			
			if status_code != 0:
				sys.exit(1)
			else:
				print('local.ini is copied to the couchDB server')

			if find_executable('scp') is not None and os.path.isfile('couchDBAddUser.py'):
				#Copy couchDBAddUser.py
				status_code = subprocess.call(['scp', '-i', keyfile, '-o', 'StrictHostKeyChecking=no', 'couchDBAddUser.py', 'ubuntu@' + hostname + ':~/'])
			
				if status_code != 0:
					sys.exit(1)
				else:
					print('couchDBAddUser.py is copied to the couchDB server')
			else:
				print('Please install scp or make sure the local.ini is in place and run the program again')
				sys.exit(1)
		else:
			print('Please install scp or make sure local.ini and couchDBAddUser.py are in place and run the program again')
			sys.exit(1)
	else:
		print('public key is missing')
		sys.exit(1)

	

	if find_executable('ansible-playbook') is not None and os.path.isfile('couchDB.yml'):
		status_code = subprocess.call(['ansible-playbook', 'couchDB.yml'])
		if status_code != 0:
			sys.exit(1)
				
		print('Ansible deploying couchDB done')
	else:
		print('ansible-playbook is not installed or couchDB.yml might be missing')
		sys.exit(1)



def main(argv):
	keyfile = ''
	hostname = ''
	try:
		opts, args = getopt.getopt(argv,"hf:o:",["keyfile=","hostname="])
	except getopt.GetoptError:
		print('deployCouchDB.py -f <keyfile> -o <hostname>')
		sys.exit(2)
	for opt, arg in opts:
		if opt == '-h':
			print 'deployCouchDB.py -f <keyfile> -o <hostname>'
			sys.exit()
		elif opt in ("-f", "--keyfile"):
			keyfile = arg
		elif opt in ("-o", "--hostname"):
			hostname = arg
	deployCouchDB(keyfile, hostname)

		

if __name__ == "__main__":
   main(sys.argv[1:])