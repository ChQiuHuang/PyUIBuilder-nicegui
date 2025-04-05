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
                        value: "#5898d4",
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
        const buttonText = this.getAttrValue("buttonText") || "Primary"
        const buttonType = this.getAttrValue("buttonType") || "primary"
        const backgroundColor = this.getAttrValue("styling.backgroundColor") || "#5898d4"
        const foregroundColor = this.getAttrValue("styling.foregroundColor") || "#ffffff"

        // Button container styles
        const buttonStyles = { // I Steal this from Rendered NiceGUI
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            borderRadius: "4px",
            outline: 0,
            border: 0,
            verticalAlign: "middle",
            cursor: "pointer",
            WebkitAppearance: "none",
            MozAppearance: "none",
            textDecoration: "none",
            color: foregroundColor,
            backgroundColor: backgroundColor,
            fontWeight: 500,
            textTransform: "uppercase",
            minHeight: "36px",
            overflow: "hidden",
        }


        // Text container styles
        const textContainerStyles = {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
            textAlign: "center",
            flex: "1 1 auto"
        }

        // Text styles
        const textStyles = {
            display: "block"
        }

        return (
            <button
                style={buttonStyles}
                tabIndex="0"
                type="button"
            >
            <span
                tabIndex="-1"
            ></span>
                <span style={textContainerStyles}>
                <span style={textStyles}>{buttonText}</span>
            </span>
            </button>
        )
    }
}
export default Button