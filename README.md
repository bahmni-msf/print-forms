# PrintForms
This repository is for printing forms in bahmni so that they can be filled offline. Currently it supports only forms 1.0(means forms under 'All Observation templates, not form builder forms).
## Dev Setting
This is completely written in angular-6.<br><br>
### Prerequisites
`brew install npm`<br><br>
`brew install http-server`  (Install http-server for checking test coverage)
#### Clone the Repository and install the dependencies
Clone the repository in bahmni folder by running following command.<br><br> 
`git clone https://github.com/bahmni-msf/print-forms.git`<br><br>
Install all the dependencies by running following commands.<br><br>
`cd print-forms && npm install -g @angular/cli && npm install && npm run build`
<br>

#### Create print-form privilege.
Run the following script inside your bahmni-vagrant-box and provide your mysql database password .<br><br>
`sh /bahmni/print-forms/scripts/create_privilege.sh`

#### Create a /print-forms url and link your local print-forms folder to bahmni.
Run following script inside your bahmni-vagrant-box.<br><br>
`sudo sh /bahmni/print-forms/scripts/dev-setup.sh`

#### Add print-forms module to bahmni.
Add following config in `default-config/openmrs/apps/home/extension.json` file to display print icon on dashboard.<br><br>
`"PrintForms": {
   "id": "bahmni.print.forms",
     "extensionPointId": "org.bahmni.home.dashboard",
     "type": "link",
     "label": "Print Forms",
     "url": "/print-forms",
     "icon": "fa fa-print",
     "order": 12,
     "requiredPrivilege": "app:print-forms"
 }`
 
#### Required privileges to access print-forms app
* Make sure the logged-in user has the privileges **Get Concepts** and **app:print-forms**.
* Optional:
  * It is recommended to create a role **Print-Forms-App** and inherit the role **Bahmni-App-User-Login** and assign above two privileges to **Print-Forms-App**
  * Add the role **Print-Forms-App** to the logged-in user.
  
After giving privilege to the logged-in user logout from bahmni and again login, now you will be able to see print-forms icon on the on the bahmni-home page.

### Build
Run `npm run build` for building the project.
### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Check test coverage in your browser

Run `ng test` for running the test.<br><br>
Run `http-server -c-1 -o -p 9875 ./coverage` to check coverage in your browser.

### Fix eslint errors.
Run following command tho fix eslint erros.
`ng lint print-forms --fix`

## Deployment Steps
### Prerequisites
`yum install wget`
### Installation Steps

* Run following command inside your bahmni-vagrant-box.<br><br>
`wget -O ./deploy.sh https://raw.githubusercontent.com/bahmni-msf/print-forms/master/scripts/deploy-print-forms.sh`<br><br> 
`sh ./deploy.sh && rm ./deploy.sh`

* Create a print-forms privilege in openmrs database.<br>
(Run following command inside your bahmni-vagrant-box and provide mysql database password ) <br><br>
`mysql -uroot -p openmrs -Bse "INSERT IGNORE INTO privilege VALUES ('app:print-forms', 'Will give access to print forms app', UUID());"`
* Add following config in `/var/www/bahmni_config/openmrs/apps/home/extension.json` file.<br><br>
`"PrintForms": {
   "id": "bahmni.print.forms",
     "extensionPointId": "org.bahmni.home.dashboard",
     "type": "link",
     "label": "Print Forms",
     "url": "/print-forms",
     "icon": "fa fa-print",
     "order": 12,
     "requiredPrivilege": "app:print-forms"
 }`
### Required privileges to access print-forms app
* Make sure the logged-in user has the privileges **Get Concepts** and **app:print-forms**.
* Optional:
  * It is recommended to create a role **Print-Forms-App** and inherit the role **Bahmni-App-User-Login** and assign above two privileges to **Print-Forms-App**
  * Add the role **Print-Forms-App** to the logged-in user.
  
After giving privilege to the logged-in user logout from bahmni and again login, now you will be able to see print-forms icon on the on the bahmni-home page.
