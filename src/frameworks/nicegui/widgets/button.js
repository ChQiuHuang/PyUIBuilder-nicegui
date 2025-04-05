import Tools from "../../../canvas/constants/tools"
import {convertObjectToKeyValueString, removeKeyFromObject } from "../../../utils/common"
import { NiceGUIWidgetBase } from "./base"

export class Button extends NiceGUIWidgetBase {
    static widgetType = "button"
    static displayName = "Button"

    constructor(props) {
        super(props)

        let newAttrs = removeKeyFromObject("layout", this.state.attrs)

        this.minSize = {width: 80, height: 36}

        this.state = {
            ...this.state,
            size: { width: 120, height: 36 },
            widgetName: "Button",
            attrs: {
                ...newAttrs,
                styling: {
                    ...newAttrs.styling,
                    backgroundColor: {
                        label: "Background Color",
                        tool: Tools.COLOR_PICKER,
                        value: "#3874ff",
                        onChange: (value) => {
                            this.setWidgetInnerStyle("backgroundColor", value)
                            this.setAttrValue("styling.backgroundColor", value)
                        }
                    },
                    foregroundColor: {
                        label: "Text Color",
                        tool: Tools.COLOR_PICKER,
                        value: "#ffffff",
                        onChange: (value) => {
                            this.setWidgetInnerStyle("color", value)
                            this.setAttrValue("styling.foregroundColor", value)
                        }
                    }
                },
                buttonText: {
                    label: "Button Text",
                    tool: Tools.INPUT,
                    toolProps: {placeholder: "Button text", maxLength: 100},
                    value: "Click me",
                    onChange: (value) => this.setAttrValue("buttonText", value)
                },
                buttonType: {
                    label: "Button Type",
                    tool: Tools.SELECT,
                    options: [
                        {label: "Primary", value: "primary"},
                        {label: "Secondary", value: "secondary"},
                        {label: "Warning", value: "warning"},
                        {label: "Danger", value: "danger"}
                    ],
                    value: "primary",
                    onChange: (value) => this.setAttrValue("buttonType", value)
                }
            }
        }
    }

    generateCode(variableName, parent) {
        const buttonText = this.getAttrValue("buttonText")
        const buttonType = this.getAttrValue("buttonType")

        const code = []

        // Create the button
        if (parent) {
            code.push(`with ${parent}:`)
            code.push(`    ${variableName} = ui.button('${buttonText}')`)
        } else {
            code.push(`${variableName} = ui.button('${buttonText}')`)
        }

        // Apply styling
        const styleClasses = []
        switch(buttonType) {
            case "primary":
                styleClasses.push('bg-blue-500 text-white')
                break
            case "secondary":
                styleClasses.push('bg-gray-500 text-white')
                break
            case "warning":
                styleClasses.push('bg-yellow-500 text-white')
                break
            case "danger":
                styleClasses.push('bg-red-500 text-white')
                break
        }

        if (styleClasses.length > 0) {
            code.push(`${variableName}.classes('${styleClasses.join(' ')}')`)
        }

        // Add event handling
        code.push(`@${variableName}.click`)
        code.push(`def handle_click():`)
        code.push(`    pass  # Handle button click`)

        return code
    }

    renderContent() {
        const buttonText = this.getAttrValue("buttonText")
        const buttonType = this.getAttrValue("buttonType")

        let buttonClass = "tw-px-4 tw-py-2 tw-rounded-md tw-text-sm tw-font-medium tw-transition-colors"

        switch(buttonType) {
            case "primary":
                buttonClass += " tw-bg-blue-500 tw-text-white hover:tw-bg-blue-600"
                break
            case "secondary":
                buttonClass += " tw-bg-gray-500 tw-text-white hover:tw-bg-gray-600"
                break
            case "warning":
                buttonClass += " tw-bg-yellow-500 tw-text-white hover:tw-bg-yellow-600"
                break
            case "danger":
                buttonClass += " tw-bg-red-500 tw-text-white hover:tw-bg-red-600"
                break
        }

        return (
            <div className="tw-flex tw-w-full tw-h-full tw-items-center tw-justify-center">
                <button className={buttonClass} style={this.getInnerRenderStyling()}>
                    {buttonText}
                </button>
            </div>
        )
    }
}
export default Button