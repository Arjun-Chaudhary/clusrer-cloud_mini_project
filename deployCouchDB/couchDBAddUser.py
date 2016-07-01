import subprocess
import os.path
from distutils.spawn import find_executable
import sys
import getopt

def main(argv):

	print('create admin user: umer')
	hostname = 'localhost'
	status_code = subprocess.call(['curl', '-X', 'PUT', 'http://' + hostname + ':5984/_config/admins/umer', '-d', '"umer"'])
			
	if status_code != 0:
		sys.exit(1)

		print('restart couchDB')
	status_code = subprocess.call(['curl', '-X', 'POST', 'http://umer:umer@' + hostname + ':5984/_restart', '-H', '"Content-Type: application/json"'])
	if status_code != 0:
		sys.exit(1)

if __name__ == "__main__":
   main(sys.argv[1:])