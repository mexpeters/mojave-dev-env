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
echo "export EDITOR='subl' -w" >> ~/.zshrc
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
