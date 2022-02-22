# SENG-480A
Carpooling Project for UVic SENG 480A

# Usage

Inside the `frontend` directory is a simple `create-react-app` project.

## dependancies

All that is needed to run it is [node](https://nodejs.org/en/). Make sure to add it is on your `PATH`. 

### Installing Node

Of course downloading node off thier site and using thier installer is an option. *But* I recommend using

Windows - [chocolatey](https://chocolatey.org/)

MacOS - [brew](https://brew.sh/)

Linux - whatever package manager your distro comes with



### Verifying install

Run `node --version` in a terminal. The output should look something like
```
[marcus@fedora ~]$ node --version
v16.13.2
```

## Running

While in the `frontend` directory run `npm install` to install dependancies.

This application uses Firebase services that need to be emulated locally. Run `npm run emulators` to start the emulators. You can view the firebase console at localhost:3001.

To start developing run `npm start`. This should open your default browser to the application. Change a file and save it and the application should reload.
