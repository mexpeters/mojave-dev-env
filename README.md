# Install Homebrew
Install Homebrew.
```bash
$ ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```
Run brew doctor to check if there are any problem.
```bash
$ brew doctor
```
Install missing libraries on mojave.
```bash
$ brew install openldap libiconv
```

# Install Apache
Install newest version.
```bash
$ sudo apachectl stop
$ sudo launchctl unload -w /System/Library/LaunchDaemons/org.apache.httpd.plist 2>/dev/null
$ brew install httpd
```

When completed correctly it should give this message:
```bash
🍺  /usr/local/Cellar/httpd/2.4.35: 1,648 files, 26.9MB
```

Run this to auto-start the service on start-up of your MacBook.
```bash
$ sudo brew services start httpd
```
Go to http://localhost:8080 and check if everything is working.


## Edit files with Sublime
Set Sublime as default editor
```bash
mkdir ~/bin
ln -s "/Applications/Sublime Text 2.app/Contents/SharedSupport/bin/subl" ~/bin/subl
echo 'export PATH=$PATH:$HOME/bin' >> ~/.zshrc
```
Now you can run $ subl [file] to edit the file you want.

## Apache Configuration
### Edit the httpd config
```bash
$ subl /usr/local/etc/httpd/httpd.conf
```
Find:
```bash
listen 8080
```
Change it to:
```bash
listen 80
```
### Change the DocumentRoot
Find:
```bash
DocumentRoot "/usr/local/var/www"
```
Change it to:
```bash
DocumentRoot /Users/MaxPeters/Sites
```
Change the 'directory' underneath that line as well:
```bash
<Directory "/Users/MaxPeters/Sites">
```
In that same 'directory' tag, change AllowOverride **None** to **All**

Find:
```bash
#LoadModule rewrite_module lib/httpd/modules/mod_rewrite.so
```
**Uncomment that line**
### User & group
Find:
```bash
User _www
Group _www
```
Change it to:
```bash
User MaxPeters
Group staff
```

### Servername
Find:
```bash
#ServerName www.example.com:8080
```
Change it to:
```bash
ServerName localhost
```

### Sites folder
Create the ~/Sites folder and create a testdocument
```bash
$ mkdir ~/Sites
$ echo "<h1>My User Web Root is working</h1>" > ~/Sites/index.html
```
Restart apache
```bash
$ sudo apachectl -k restart
```
Check http://localhost, it should display : 'My User Web Root is working'.


# Install PHP
To install PHP Version 7.2 run:
```bash
$ brew install php@7.2
```
Run this command to check if the right PHP version is installed
```bash
$ php -v
```

# PHP Apache Setup
Edit httpd config
```bash
$ subl /usr/local/etc/httpd/httpd.conf
```
The last change I made to this was:
```bash
LoadModule rewrite_module lib/httpd/modules/mod_rewrite.so
```
Underneath this line, add: ( The other PHP versions are for PHP-switching, but I don't  use that right now )
```bash
#LoadModule php5_module /usr/local/opt/php@5.6/lib/httpd/modules/libphp5.so
#LoadModule php7_module /usr/local/opt/php@7.0/lib/httpd/modules/libphp7.so
#LoadModule php7_module /usr/local/opt/php@7.1/lib/httpd/modules/libphp7.so
LoadModule php7_module /usr/local/opt/php@7.2/lib/httpd/modules/libphp7.so
```
Find:
```bash
<IfModule dir_module>
    DirectoryIndex index.html
</IfModule>
```
Change it to:
```bash
<IfModule dir_module>
    DirectoryIndex index.php index.html
</IfModule>

<FilesMatch \.php$>
    SetHandler application/x-httpd-php
</FilesMatch>
```

Save the file & stop and restart apache
```bash
$ sudo apachectl -k stop
$ sudo apachectl start
```
Test if PHP is working by creating a testfile.
```bash
echo "<?php phpinfo();" > ~/Sites/info.php
```
If it's working correctly it should show PHP information.

# MySQL
To install MySQL run these commands:
```bash
$ brew update
$ brew install mysql
```
To auto-start MySQL Server:
```bash
$ brew services start mysql
```
Download MySequel Pro, http://www.sequelpro.com/

**_Try to connect through socket without filling in anything, if it doesn't work try user: root, password: -._**
### MySQL Login fix
Open terminal and login.
```bash
$ mysql -u root
or
$ mysql -u root -p
```
Then :
```bash
$ ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';
if that doesn't work;
$ ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '[password]';
$ exit
```
Restart MySQL Sever
```bash
$ brew services stop mysql
$ brew services start mysql
```

# Apache Virtual Hosts
Edit httpd config
```bash
subl /usr/local/etc/httpd/httpd.conf
```
Uncomment these lines
```bash
$ LoadModule vhost_alias_module lib/httpd/modules/mod_vhost_alias.so

# Virtual hosts
Include /usr/local/etc/httpd/extra/httpd-vhosts.conf
```

Now I can edit the vhosts file and setup a virtual host.
```bash
$ subl /usr/local/etc/httpd/extra/httpd-vhosts.conf
```
Comment the dummy virtual hosts out and add these lines:
```bash
<VirtualHost *:80>
    DocumentRoot "/Users/MaxPeters/Sites"
    ServerName localhost
</VirtualHost>

<VirtualHost *:80>
    DocumentRoot "/Users/MaxPeters/Sites/test.local"
    ServerName test.local
</VirtualHost>
```
Create a test.local inside ~/Sites and add an HTML to test. Then go to test.local and check if it works.

# Install NVM
Install NVM
```bash
$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
```
If nvm --version doesn't work:
```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
```
### Install Node
Install Node and use latest version ( May have to run a command, terminal will tell for fix )
```bash
$ nvm install node
$ nvm use node
$ nvm install --lts
$ nvm use --lts
```
```
