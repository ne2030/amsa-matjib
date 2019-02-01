const hasProp = key => menu => menu[key];
const delay = t => new Promise((res) => {
    setTimeout(res, t);
});

const optionEls = {
    lunch: document.querySelector('.option-box .lunch'),
    seafood: document.querySelector('.option-box .seafood'),
    drink: document.querySelector('.option-box .drink')
}

const Els = {
    menuViewer: document.querySelector('.menu-viewer'),
    todayMenuBtn: document.querySelector('.todayMenuBtn')
}

const filterIf = (val, fn) => coll => val ? _.filter(coll, fn) : coll;
const rejectIf = (val, fn) => coll => val ? _.reject(coll, fn) : coll;

const menuGenerator = function* (menus, option) {
    const randoms = _.go(
        menus,
        filterIf(option.lunch.checked, hasProp('lunch')),
        rejectIf(option.drink.checked, hasProp('drink')),
        rejectIf(option.seafood.checked, hasProp('seafood')),
        // _.filter(m => m.kind.includes(prefer)),
        _.shuffle,
    );
    yield* randoms;
}

const getTodayMenu = menuGenerator(menus, optionEls);

const logMenu = menu => Els.menuViewer.innerText = menu;

const optionFix = () => _.each(_.values(optionEls), el => el.disabled = true)

let afterCall = 0;
let fixed = false;
const menuBtnHandler = (e) => {
    if (!fixed) { fixed = true, optionFix() }
    const result = getTodayMenu.next();
    return result.value ? logMenu(result.value.name) :
        afterCall > 10 ? logMenu('그만 눌러라 좀') : (afterCall++ , logMenu('끝'))
}

Els.todayMenuBtn.onclick = menuBtnHandler;