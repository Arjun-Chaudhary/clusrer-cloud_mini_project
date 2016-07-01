# cluster_cloud_computing_assignment2

### Prerequsite

Before you run any of the deployment commands please make sure the following requirements are fullfilled

  - cloud.ky is in the deployment root folder, if the key is protected with password, you will have to enter it manually during the deployment process. The default cloud.key is in place along with this package as well as its password is in passward.txt.

  -  To create instance, you need to have the followings
  	- EC2_ACCESS_KEY
  	- EC2_SECRET_KEY

These keys setting are in main.sh. Please ensure to change them accordingly before you run this package to deploy to a different project space other than the developing envirnment for this assignment.
  - In boto_main.py, the default key pair is to run on the envirnment for this particular assignment. If you are planning to run this in a different cloud service, please do ensure you change the following setting accordingly.
  
  	- image_name = 'NeCTAR Ubuntu 14.04 (Trusty) amd64'
	- image_id = 'ami-000022b3'
	- availbility_zone = 'melbourne-qh2'
	- instance_flavor = 'm1.medium'
	- security_groups = ['ssh', 'http', 'default']
	- instance_profile_name = 'temp_test1'
	- volume_size = '250'
	- key_pair = 'umersKey'
	- base_port=5984

### Troubleshootings

When it is cloned to your local environment, the following error message might occur:

Permissions 0775 for '/home/cluster_cloud_computing_assignment2/cloud.key' are too open

Please chmod to 700 as below
```sh
$chmod 700 cloud.key
```

### Deployment

Deploy Instance

```sh
$./main.sh <options> <instance_num>
```
Ex:

```sh
$./main.sh 1 1
```

Deploy CouchDB

```sh
$./main.sh <options> <host_dest_ip>
```
Ex:

```sh
$./main.sh 2 127.0.0.1
```
Deploy Harvester

```sh
$./main.sh <options> <host_dest_ip> <dbServer_ip>
```
Ex:

```sh
$./main.sh 3 127.0.0.1 127.0.0.1
```
Run Harvester

```sh
$./main.sh <options> <host_dest_ip> <dbServer_ip>
```
Ex:

```sh
$./main.sh 4 127.0.0.1 127.0.0.1
```
Deploy DataProcessor

```sh
$./main.sh <options> <host_dest_ip> <dbServer_ip>
```
Ex:

```sh
$./main.sh 5 127.0.0.1 127.0.0.1
```
Run DataProcessor,
```sh
$./main.sh <options> <host_dest_ip>
```
Ex:
```sh
$./main.sh 6 127.0.0.1
```

Deploy Frontend

```sh
$./main.sh <options> <host_dest_ip> <dbServer_ip>
```
Ex:

```sh
$./main.sh 7 127.0.0.1 127.0.0.1
```
