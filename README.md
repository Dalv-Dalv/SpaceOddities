<h1> Space Oddities </h1>
University of Bucharest | Web Course Project

This website features a fully responsive design, it implements GLSL shaders as hero screens. The page is meant to read like an article to discover interesting things about space.

There are also quizzes at each section which also feature responsive design. The quizzes utilize AJAX promises to fetch the quiz data depending on which quiz button was pressed back in the main page.
Also, the quiz uses the html `template` element to instantiate each quizz question, allowing for flexible editing without having to modify the javascript code to change the styling.

On the final section of the article, there is a small gravity simulation game which uses canvas to draw the screen, the simulation is made to run on discrete time steps and the trajectory predictions are done also by simulating discrete time steps into the future.



Requirements and implementations:
Cerinte HTML/CSS:
- WORK IN PROGRESS
- [X] Fisiere separate pentru HTML si CSS
- [X] Conținutul site-ului trebuie să aibă sens (nu îl umpleți cu Lorem ipsum)
- [X] Nu este acceptată folosirea de frameworkuri și biblioteci
HTML:
- [ ] Trecerea testelor de validare HTML http://validator.w3.org/
    -  Multe erori de la SVG
- [X] Folosirea tagurilor semantice prezentate la curs/laborator
CSS:
- [X] Trecerea testelor de validare CSS https://jigsaw.w3.org/css-validator/
- [X] Folosirea selectorilor CSS de bază (după id, clasă, tag, elementContinut, elementCopil, al n-lea copil de tipul unui tag :nth-of-type)
- [X] Specificarea proprietăților: width, height, color, background, font-size, border, padding, margin, display etc.
- [X] Folosirea coloanelor pentru layoutul a cel puțin unei pagini; realizarea layoutului fără tabele (folosind flex și grid)
    - Folosite in sectiunea/butoanele de 'Curiosities'
- [X] Site-ul trebuie să conțină un menu drop-down (sau altfel expandabil) realizat cu CSS
- [X] Site-ul trebuie să conțină o tranziție care implică schimbarea mai multor proprietăți la intervale diferite de timp
- [X] Site-ul trebuie să conțină o animație care să modifice mai multe proprietăți ale aceluiași element
    - Call to actionul de la inceputul paginii
- [X] !Bonus point! pentru generarea conținutului folosind :after, :before (dar să aibă sens; fiți creativi)
    - Call to actionul de la inceputul paginii
     
Javascript:

P.S: Thank you for the book, I really appreciate it! 😊
