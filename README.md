# Space Oddities

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/eab7128c-cf30-48cd-8ac0-4e37f1e0dd21" />


This website features a fully responsive design, it implements GLSL shaders as hero screens. The page is meant to read like an article to discover interesting things about space.

There are also quizzes at each section which also feature responsive design. The quizzes utilize AJAX promises to fetch the quiz data depending on which quiz button was pressed back in the main page.
Also, the quiz uses the html `template` element to instantiate each quizz question, allowing for flexible editing without having to modify the javascript code to change the styling.

On the final section of the article, there is a small gravity simulation game which uses canvas to draw the screen, the simulation is made to run on discrete time steps and the trajectory predictions are done also by simulating discrete time steps into the future.



# Requirements and implementations:
## Cerinte HTML/CSS:
- [X] Fisiere separate pentru HTML si CSS
- [X] Conținutul site-ului trebuie să aibă sens (nu îl umpleți cu Lorem ipsum)
- [X] Nu este acceptată folosirea de frameworkuri și biblioteci
### HTML:
- [ ] Trecerea testelor de validare HTML http://validator.w3.org/
    -  Multe erori de la SVG
- [X] Folosirea tagurilor semantice prezentate la curs/laborator
### CSS:
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
     
### Javascript:
- [X] Fișier separat pentru codul JavaScript
- [X] Modificarea stilului unui element sau al unui grup de elemente
    - Realizat in cadrul efectului de raspuns din quizuri
- [X] Manipularea DOM-ului (selectare după id, tag, clasă, folosind selectori CSS)
- [X] Crearea și stergerea de elemente HTML
    - Crearea intrebarilor in quizuri
- [X] Folosirea și modificarea evenimentelor generate de mouse si tastatură
    - Simulatorul de gravitatie
- [X] Modificare de proprietăți
- [X] Inputuri funcționale (de exemplu: input de tip text/range/number/radio/checkbox, select, textarea)
- [X] Folosirea setTimeout sau setInterval
- [X] Folosirea localStorage (să se pastreze în localStorage o colecție de elemente)
    - Folosit pentru a stoca scorul din quizuri
- [X] Folosirea a cel puțin unei metode din clasele: Math, Array, String, Date
    - Folosit pentru a randomiza ordinea intrebarilor din quizuri
- [ ] Schimbarea aleatoare a valorilor unei proprietăți (de exemplu: culoare, dimensiuni, poziție)
- [X] Folosirea proprietăților classList, target sau currentTarget
- [X] Folosirea metodelor getComputedStyle, stopPropagation
    - Folosit pentru a prelua variable CSS din Javascript in cadrul quiz
- [ ] Validarea datelor dintr-un formular folosind expresii regulate

### AJAX
- [X] Cereri Ajax cu preluare date dintr-un fișier json
- [X] Sesiuni: e.g. login/logout (folosind Storage / fișier json)
    - Oarecum, prin salvarea scorurilor de pe quizuri


P.S: Thank you for the book, I really appreciate it! 😊
