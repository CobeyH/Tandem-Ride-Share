# Tandem
![smol](https://user-images.githubusercontent.com/51931484/157334498-2952ad7f-9b7a-4fe8-b9ae-97932ff16fa9.png)


Tandem is a application built to make carpooling delightful - [check it out](https://carpooling-6112a.web.app/).

# Members

Contact us with a bug or suggestion by making an issue.

Checkout [who built this](https://github.com/CobeyH/SENG-480A/wiki/Team-Contributions) application on our [wiki](https://github.com/CobeyH/SENG-480A/wiki)

# Milestones

## Presentations

[Milestone 1](https://docs.google.com/presentation/d/1_4aRN1ntUCg57fo2Yi9Icr5uLC00o3nwxvoE6tQif-0/edit?usp=sharing)

[Milestone 2](https://docs.google.com/presentation/d/1xmXsBqUpmiAcZRO8HfMe55J8MQXNO3-oCCqqMlNhIt8/edit?usp=sharing)

# Contributing

Try to make an issue before trying to fix it, you may find someone is already on it!

Barring that, make a pull request with your changes - we prefer, although do not enforce, a linear git history.

Someone *should* come along and review your code, if it looks good your changes should be live as soon as they are merged!

## Dependancies

All that is needed to run it is [node](https://nodejs.org/en/). Make sure to add it is on your `PATH`. 

### Installing Node

Of course downloading node off thier site and using their installer is an option. *But* I recommend using

Windows - [chocolatey](https://chocolatey.org/)

MacOS - [brew](https://brew.sh/)

Linux - whatever package manager your distro comes with

### Verifying install

Run `node --version` in a terminal. The output should look something like
```
[marcus@fedora ~]$ node --version
v16.13.2
```

### Hitting MapQuest Api

This app relies on the MapQuest API for some features, in order to use them acquire a key from [here](https://www.mapquest.com/)
and create an `.env` file in `frontend` with `REACT_APP_MQ_KEY=<YOUR KEY>`.

## Running a Development Server

While in the `frontend` directory run `npm install` to install dependancies.

This application uses Firebase services that need to be emulated locally. Run `npm run emulators` to start the emulators. You can view the firebase console at localhost:3001.

To start developing run `npm start`. This should open your default browser to the application. Change a file and save it and the application should reload.

# License

We're GPL-3.0 licensed, if you don't like the license in [its full glory](https://github.com/CobeyH/SENG-480A/blob/main/LICENSE), [this](https://choosealicense.com/licenses/gpl-3.0/) is a nice synopsis.
