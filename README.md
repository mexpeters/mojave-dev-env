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
