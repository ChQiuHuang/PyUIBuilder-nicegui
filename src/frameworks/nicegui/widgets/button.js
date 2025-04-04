import Tools from "../../../canvas/constants/tools"
import { convertObjectToKeyValueString } from "../../../utils/common"
import { NiceGUI } from "./base"

class Button extends NiceGUI {
    static widgetType = "button"
    static displayName = "Button"

    constructor(props) {
        super(props)

        this.state = {
            ...this.state,
            size: { width: 80, height: 40 },
            widgetName: "Button",
            attrs: {
                ...this.state.attrs,
                buttonLabel: {
                    label: "Button Label",
                    tool: Tools.INPUT,
                    toolProps: {placeholder: "Button label", maxLength: 100},
                    value: "Button",
                    onChange: (value) => this.setAttrValue("buttonLabel", value)
                },
                buttonColor: {
                    label: "Button Color",
                    tool: Tools.COLOR_PICKER,
                    value: "primary", // NiceGUI default color
                    onChange: (value) => this.setAttrValue("buttonColor", value)
                },
                buttonIcon: {
                    label: "Button Icon",
                    tool: Tools.INPUT,
                    toolProps: {placeholder: "Icon name (optional)"},
                    value: "",
                    onChange: (value) => this.setAttrValue("buttonIcon", value)
                },
                onClickFunction: {
                    label: "On Click Function",
                    tool: Tools.INPUT,
                    toolProps: {placeholder: "Function to call on click"},
                    value: "",
                    onChange: (value) => this.setAttrValue("onClickFunction", value)
                }
            }
        }
    }

    componentDidMount() {
        super.componentDidMount()
        this.setAttrValue("styling.backgroundColor", "#E4E2E2")
    }

    generateCode(variableName, parent) {
        const labelText = this.getAttrValue("buttonLabel")
        const buttonColor = this.getAttrValue("buttonColor") || "primary"
        const buttonIcon = this.getAttrValue("buttonIcon") || "None"
        const onClickFunction = this.getAttrValue("onClickFunction") || "None"

        // Format the function parameter properly
        const onClickParam = onClickFunction && onClickFunction !== "None"
            ? `on_click=${onClickFunction}`
            : "";

        // Format the icon parameter properly
        const iconParam = buttonIcon && buttonIcon !== "None"
            ? `icon="${buttonIcon}"`
            : "";

        const params = [
            `text="${labelText}"`,
            `color="${buttonColor}"`,
            iconParam,
            onClickParam
        ].filter(Boolean).join(", ");

        return [
            `${variableName} = ui.button(${params})`,
        ]
    }

    getToolbarAttrs() {
        const toolBarAttrs = super.getToolbarAttrs()

        return ({
            id: this.__id,
            widgetName: toolBarAttrs.widgetName,
            buttonLabel: this.state.attrs.buttonLabel,
            buttonColor: this.state.attrs.buttonColor,
            buttonIcon: this.state.attrs.buttonIcon,
            onClickFunction: this.state.attrs.onClickFunction,
            size: toolBarAttrs.size,
            ...this.state.attrs,
        })
    }

    renderContent() {
        const buttonColor = this.getAttrValue("buttonColor") || "primary"
        const buttonIcon = this.getAttrValue("buttonIcon")
        const label = this.getAttrValue("buttonLabel")

        // Map NiceGUI color keywords to hex values (customize if needed)
        const colorMap = {
            'primary': '#1976D2',
            'secondary': '#26A69A',
            'accent': '#9C27B0',
            'positive': '#21BA45',
            'negative': '#C10015',
            'info': '#31CCEC',
            'warning': '#F2C037'
        }

        const backgroundColor = colorMap[buttonColor] || buttonColor
        const textColor = this.isLightColor(backgroundColor) ? '#000000' : '#ffffff'

        return (
            <div className="tw-w-full tw-h-full tw-flex tw-items-center tw-justify-center">
                <button
                    ref={this.styleAreaRef}
                    className="tw-px-4 tw-py-2 tw-rounded-2xl tw-shadow-md tw-text-sm tw-font-medium tw-flex tw-items-center tw-gap-2 tw-transition-all hover:tw-brightness-90"
                    style={{
                        backgroundColor: backgroundColor,
                        color: textColor,
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >
                    {buttonIcon && (
                        <i className="material-icons tw-text-base">{buttonIcon}</i>
                    )}
                    {label}
                </button>
            </div>
        )
    }


    // Helper method to determine if text should be dark or light based on background
    isLightColor(color) {
        // Simple implementation - can be improved
        const isHex = color.startsWith('#')
        if (!isHex) return false;

        // Convert hex to RGB and check lightness
        const hex = color.replace('#', '')
        const r = parseInt(hex.substr(0, 2), 16)
        const g = parseInt(hex.substr(2, 2), 16)
        const b = parseInt(hex.substr(4, 2), 16)

        // Formula to determine perceived brightness
        return (r * 0.299 + g * 0.587 + b * 0.114) > 150
    }
}

export default Button