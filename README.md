## Install Homebrew
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

## Install Apache
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
Edit the httpd config
```bash
$ subl /usr/local/etc/httpd/httpd.conf
```
---
Find:
```bash
listen 8080
```
Change it to:
```bash
listen 80
```
---
Change the documentroot
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
---
Find:
```bash
#LoadModule rewrite_module lib/httpd/modules/mod_rewrite.so
```
**Uncomment that line**
---
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
---
