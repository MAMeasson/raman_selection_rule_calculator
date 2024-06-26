# Raman_Selection_Rule_Calculator

## About the program

This software was written during the PhD of Grégory SETNIKAR. It answers the need of a comprehensive tool for determination of the selection rules for Raman scattering with two available databases (Bilbao and Loudon and Hayes):

- The symmetry of the crystal (space group)
- The orientation of the crystal
- The Poynting vector
- Polarizations of the incident and scattered light

The graphical interface is built as a web application using Node.js and classical web development tools (HTML5, CSS, JavaScript).
Computations are done using Python 3 and all the results are plotted or saved in LaTeX. 

The web application is available on http://www.raman-selection-rules-calculator.fr

## Installation

In order to use this software you need the following librairies: 

- [Node.js](https://nodejs.org/en/)
- [Python3](https://www.python.org/downloads/)
- [Numpy](https://numpy.org)
- [Sympy](https://www.sympy.org/en/index.html)


You also need to have Python 3 accessible on your laptop (in your path environment variable).
If you haven’t a proper installation of python and/or the following libraries the program will not compute anything, but the interface will still work.

Once everything is set, clone this repository and open a shell in it. 
Then you can install node modules typing:

```
npm install
```
Then you can run the program with:

```
node .\server.js
```

Server.js will generate the web app on the local port 8080, that you can listen on http://localhost:8080 with your standard web navigator.

## Usage

You will find all the information in the section « Docs/How to Use » directly inside the web app.

## Roadmap

- Standalone offline application are currently built (using the Electron framework).
- Add a leaks computation feature for every geometry
- Add a visualization feature for every geometry 

## Contributing

If you have any questions or suggestions about this software please contact Marie-Aude MÉASSON (marie-aude.measson@neel.cnrs.fr) or Grégory SETNIKAR (gregory.setnikar@pm.me)

## Authors and acknowledgment

Grégory SETNIKAR is the main developer (all the calculations and the interface), Julien SAMSON contributes by convert the application (Electron/Node.js) into a standalone web server (Node.js/Express), finally Marie-Aude MÉASSON supervised the project and provided her expertise in the Raman selection rules calculations.

## License

We are academics and this software is open source and licensed under the terms and conditions of the GNU GPL license .
