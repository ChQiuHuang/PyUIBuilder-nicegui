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
                buttonText: {
                    label: "Button Text",
                    tool: Tools.INPUT,
                    toolProps: {placeholder: "Button text", maxLength: 100},
                    value: "Click me",
                    onChange: (value) => this.setAttrValue("buttonText", value)
                },
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

        code.push(`${variableName}.classes('bg-blue-500 text-white')`)

        // Add event handling
        code.push(`@${variableName}.click`)
        code.push(`def handle_click():`)
        code.push(`    pass  # Handle button click`)

        return code
    }

    renderContent() {
        const buttonText = this.getAttrValue("buttonText") || "IDK WHY THIS IS HERE, BUT IT IS."
        const backgroundColor = this.getAttrValue("styling.backgroundColor") || "#5898d4"
        const foregroundColor = this.getAttrValue("styling.foregroundColor") || "#ffffff"

        // Button container styles
        const buttonStyles = { // I Steal this from Rendered NiceGUI, -What you just see, is ass.-
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            padding: "0.285em 0.857em",
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
            letterSpacing: "0.0892857143em",
            minHeight: "36px",
            transition: "background-color 0.3s, color 0.3s",
            overflow: "hidden",
            userSelect: "none",
            width: "100%",
            height: "100%"
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