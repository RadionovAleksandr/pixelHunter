console.log(` модуль AbstractView 
отдает элемент: get element();

`);
export default class AbstractView {
    constructor() {
        if (new.target === AbstractView) {
            throw new Error(`Can't instantiate AbstractView, only concrete one`);
        }
    }

    get template() {
        throw new Error(`Template is required`);
    }

    get element() {
        if (this._element) {
            return this._element;
        }
        this._element = this.render();
        this.bind(this._element);
        return this._element;
    }

    render() {
        const div = document.createElement(`div`);
        div.innerHTML = this.template.trim();
        return div;
    }

    bind() {}
}