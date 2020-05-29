export class LanTableOperationColumnButton {
    constructor ({ text, type, icon, handler, disabled = false }) {
        this.text = text;
        this.type = type || 'default';
        this.icon = icon;
        this.handler = handler;
        this.disabled = _.isFunction(disabled) ? disabled : () => disabled;
    }
}
