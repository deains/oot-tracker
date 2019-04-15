# OoT location tracker

### What is this?

It's a small web app to keep track of which locations you've visted in Legend of Zelda: Ocarina of Time. It's designed to help you whilst playing the [OoT Randomizer](https://ootrandomizer.com/).

### Why not use \<insert tracker here>?

Most map trackers for OoT include item logic to show you where you can go next. I don't like this, as I feel it takes away from an important aspect of the game (making routing decisions). That's why I made my own.

The primary purpose of this tracker is to help players remember where they have already been, and remind them of checks in an area that might have been forgotten or overlooked. It leaves decision-making up to the player themselves.

This tracker is also built to have a simple, clean layout that can be used quickly and easily whilst playing the game, without being a distraction.

### How do I use it?

The current version is available on GitHub pages: [OoT tracker](https://deains.github.io/oot-tracker). You can bookmark this as a web app or pin it to your Start menu.

Click on an area node to expand the list of checks. Click on individual checks to mark them as complete, click again (or right click) to unmark them. You can also mark a location as barren/foolish by middle-clicking it.

Area nodes will automatically update to show you how many checks remain in that area. Skulltula tokens and gossip stones are not counted.

The Settings button in the bottom right allows you to change how the tracker works and include/exclude certain checks from the lists.

The Reset button in the bottom right will completely reset the tracker back to its default state. Note that reloading the page will not reset the tracker (so you can come back later), only clicking the reset button. Your settings are always saved and will not be lost when resetting.

### I found a problem, what should I do?

1. Don't panic
2. Create an issue on GitHub describing what went wrong. Please try and give as much useful information as you can.

### I have a suggestion/want to help, what do I do?

Create a pull request or an issue using the link above. New contributions to this tracker are welcome.

### Can I use this for another project?

You are free to re-use this code for other works, provided you maintain the original copyright notice (see [LICENSE](LICENSE) file).

## Developer information

This section covers how you can build/develop this project.

### Requirements

To run the build tools you need to install:

* GNU Make
* NodeJS/NPM

This project has been tested using Linux, but it ought to work on other platforms.

### Build/Deploying

Run `make` (or `make optimize`) to install dependencies and run the r.js optimizer. The results will be saved into the **dist** folder.

Once this step is done, run `make publish` to push the optimized web files to the `gh-pages` branch (if you have permission), or `make zip` to create a zip file.
